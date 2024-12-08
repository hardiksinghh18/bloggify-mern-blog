const jwt = require('jsonwebtoken')
const Register = require('../models/usermodel')

const ACCESS_TOKEN_KEY = 'jwt-access-token-secret-key'
const REFRESH_TOKEN_KEY = 'jwt-refresh-token-secret-key'

const auth = async (req, res, next) => {
    const token = await req.cookies.jwt;
    console.log(token)
//    if(!token) return res.json({message:'Token not provided'})
   
    try {
       
       
            console.log(`token from cookie : ${token}`)

            // if (!token) return res.json({valid:false, msg: "No token provided" })

            const verifyUser = await jwt.verify(token, ACCESS_TOKEN_KEY)


            // console.log(verifyUser)

            const userData = await Register.findOne({ _id: verifyUser._id })
            // console.log(userData)
            req.token = token;
            req.userData = userData
            // console.log(`token after logout : ${token}`)



            next();
        

    } catch (error) {
        console.log('error in auth.js', error)
        // res.json({ valid: false, message: 'authentication failed' })
        return res.status(401).json({message:'Token not provided'})
    }
}


module.exports = auth;