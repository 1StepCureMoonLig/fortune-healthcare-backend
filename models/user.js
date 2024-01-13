const mongoose = require('mongoose')
const bcrypt = require('bcrypt') 


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
        },
    password: {
        type:String,
        required: true,
        minlength: 6
    }
})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function(email, password) {
    try{
        const user = await this.findOne({email})
        if(user){
            const auth = await bcrypt.compare(password,user.password)
            if (auth){
                return user
            }else {
                throw new Error("Invalid password");
            }
        }else {
            throw new Error("Invalid user");
        }
    } catch (error){
        throw { Error : error.message };
    }
}
const User = mongoose.model('user', userSchema)

module.exports = User