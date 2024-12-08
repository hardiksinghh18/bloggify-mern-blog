const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate(email) {
            validator.isEmail(email)
        }
    },
    profileImage:{
        type:String
    },
    bio:{
type:String
    }
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
})

userSchema.methods.generateAuthToken = async function () {
    try {

        const token = jwt.sign({ email:this.email },process.env.ACCESS_TOKEN_KEY,{expiresIn:'1d'});
       
        // this.tokens = this.tokens.concat({token: token })

        await this.save();
        
        return token
    } catch (error) {
        console.log(error)
    }
}
userSchema.methods.generateRefreshToken = async function () {
    try {

        const refreshToken = jwt.sign({ email:this.email },process.env.REFRESH_TOKEN_KEY,{expiresIn:'30d'});
       
        // this.tokens = this.tokens.concat({token: token })

        // await this.save();
        
        return refreshToken
    } catch (error) {
        console.log(error)
    }
}



userSchema.pre('save', async function (next) {

    try {
        if (this.isModified('password')) {
            const hashPassword = await bcrypt.hash(this.password, 10);
            this.password = hashPassword;
        }
        next();
    } catch (error) {
        console.log(error)
    }
})

const Register = new mongoose.model("Register", userSchema);
module.exports = Register;
