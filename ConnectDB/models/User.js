const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name : { type:'String', required:true },
    age : { type:'Number',required:true },
    email : { 
                type:'String',
                required:true,
                unique:true,
                lowercase:true,
                validate:[emailValidator,'invalid email format']

            },
    password : {type:'String',required:true}

})

function emailValidator(value)
{
    return /^.+@.+\..+$/.test(value);
}

//when two different user enter same password then hash values are added to password field
userSchema.pre('save',async function(next){
    try
    {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password,salt)
        this.password = passwordHash    
        next()
    }
    catch(err)
    {
        next(err)
    }
})

//while login we can compare user provided password with its hased password in db
userSchema.methods.isPasswordValid = async function (value) {
    try {
        return await bcrypt.compare(value, this.password);
    } catch (error) {
        throw new Error(error);
    }
};
module.exports = mongoose.model('user',userSchema)