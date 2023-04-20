const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [emailValidator, 'incorrect mail format']
    },
    password: { type: String, required: true,validate:[passwordValidator,'password must be minimum of 6 characters including 1 sysmbol and 1 number']},

    userName : { type:String },
    bio : { type:String },
    gender : { type:String },
    dob : { type:Date },
    mobile : { type:String},
    profilePicture : { type:String},
    removeImg : {type:Boolean,default:false}
});

function emailValidator(value)
{
    return /^.+@.+\..+$/.test(value);
}

function passwordValidator(value)
{
    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    
    if(value.length<6)
    {
        return false
    }
    if(format.test(value)&&(/\d/.test(value)))
    {
        return true
    }
    else
    {
        return false
    }
   
}
    


userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordValid = async function (value) {
    try {
        return await bcrypt.compare(value, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('user', userSchema);