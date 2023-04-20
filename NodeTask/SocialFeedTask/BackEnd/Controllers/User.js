const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('./../config')
const {GOOGLE_CLIENT_ID} = require('./../config')
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require("google-auth-library");


const client = new OAuth2Client({
  clientId: `${process.env.GOOGLE_CLIENT_ID}`,
});


//---------------------------------------REGISTER USER------------------------------------
exports.signup = async (req,resp,next) =>
{
    const { firstName,lastName,email,password } = req.body
    const user = await User.findOne({ email })
    if (user)
        return resp.status(403).json({ error: { message: 'Email already in use!' } })

    const newUser = new User({ firstName,lastName,email, password });
    try 
    {
        await newUser.save();
        // const token = getSignedToken(newUser);
        resp.status(200).json({ message:'success'});
        // resp.status(200).json({token})
    } catch (error) {
        error.status = 400;
        next(error);
    }
}


//--------------------------------------LOGIN USER-------------------------------------
exports.login = async (req, resp, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user)
        return resp.status(403).json({ error: { message: 'Invalid email' } });
    const isValid = await user.isPasswordValid(password);
    if (!isValid)
        return resp.status(403).json({ error: { message: 'Invalid password' } });
    const token = getSignedToken(user);
  
    resp.status(200).json({user,token});
};

//--------------------------------------GOOGLE LOGIN------------------------------------
exports.googleLogin = async (req, res, next) => 
{
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      requiredAudience: `${process.env.GOOGLE_CLIENT_ID}`,
    });
    const payload = ticket.getPayload();
    // console.log(payload)

    try 
    {
        let user = await User.findOne({ email: payload.email });
        console.log(user);
        if (!user) 
        {
            return res.status(400).send({
            Error: true,
            message: "User not registered! Please sign up to continue",
            })
        } 
        else 
        {
            const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
            SECRET_KEY,
            {
                expiresIn: "10h",
            })

            return res.status(200).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token,
            })
        }
    } catch (err) {
      console.log(err);
      return res.status(401).send(` ${err}`);
    }
  }

//-----------------------------------GET ALL USER----------------------------------
exports.getAllUser = async(req,resp,next) => 
{
    const users = await User.find();
    resp.status(200).json(users);
}


//--------------------------------------GET USER BY ID----------------------------------
exports.getUserById = async (req, resp, next) => 
{
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        resp.status(200).json(user);
    } catch (error) {
        resp.status(400).json({message:error.message})
        next(error);
    }
};

//------------------------------------- CHANGE PASSWORD---------------------------------
exports.changePassword = async(req,resp,next) => 
{
    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    
    const {oldPassword , newPassword , confirmPassword} = req.body
    const Current_user = req.user
    // console.log(req.user);
    if(bcrypt.compareSync(oldPassword,Current_user.password))
    {
        if(newPassword == confirmPassword)
        {
            try {
                if(newPassword.length<6) 
                {
                        resp.status(403).json({message:'password must be minimum of 6 characters including 1 sysmbol and 1 number'})
                }
                
                else if(format.test(newPassword)==false || (/\d/.test(newPassword))==false)
                {  
                    resp.status(403).json({message:'password must be minimum of 6 characters including 1 sysmbol and 1 number'})
                }
                else
                {
                    const salt = await bcrypt.genSalt(10);
                    const passwordHash = await bcrypt.hash(newPassword, salt);
                    await User.findByIdAndUpdate(Current_user.id, {password:passwordHash});
                    resp.status(200).json({ success: true });
                }
            } catch (error) {
                error.status = 400;
                next(error);
            }
        }
        else
        {
            resp.status(403).json({message:'password does not match'})
        }
    }
    else
    {
        resp.status(403).json({message:'oldpassword does not match'})
    }
   
}

//-----------------------------------------EDIT PROFILE----------------------------------
exports.editProfile = async(req,resp,next) =>
{
    let {userID} = req.params
    const user1 = await User.findById({ _id: current_user._id });
    // console.log(userID);
    try {
        if(req.removeImg === true)
        {
            await User.findByIdAndUpdate(userID,{...req.body,profilePicture:""})
        }
        else
        {
            await User.findByIdAndUpdate(userID, {  
                                                    userName:req.body.userName ,
                                                    bio:req.body.bio ,
                                                    gender:req.body.gender ,
                                                    dob : req.body.dob ,
                                                    mobile : req.body.mobile ,
                                                    profilePicture: req.file ? req.file.path : user1.profilePicture});

            const user = await User.findById(userID)
            console.log(user)
            resp.status(200).json({ success: true,user });
        }
       
    } catch (error) {
        resp.status(400).json({message:error.message})
        next(error);
    }
}


getSignedToken = user => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        name:user.name,
        password:user.password,
        userName:user.userName || "",
        profilePicture:user.profilePicture
    },SECRET_KEY, { expiresIn: '24h' });
};

