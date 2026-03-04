const jwt = require('jsonwebtoken')
const Register = require('../models/usermodel')

const ACCESS_TOKEN_KEY = 'jwt-access-token-secret-key'
const REFRESH_TOKEN_KEY = 'jwt-refresh-token-secret-key'

const auth = async (req, res, next) => {
    const token = await req.cookies.jwt;
    try {
        const verifyUser = await jwt.verify(token, ACCESS_TOKEN_KEY)
        const userData = await Register.findOne({ _id: verifyUser._id })
        req.token = token;
        req.userData = userData
        next();
    } catch (error) {
        console.log('error in auth.js', error)
        return res.status(401).json({ message: 'Token not provided' })
    }
}


module.exports = auth;