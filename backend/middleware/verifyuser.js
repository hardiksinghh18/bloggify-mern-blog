const jwt = require('jsonwebtoken')
const Register = require('../models/usermodel')
require('dotenv').config();


const verifyuser = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        if (renewToken(req, res)) {
            return next()
            
        }
    } else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Token" })
            } else {
                req.email = decoded.email
                return next();

              
            }
        })
    
   }
  } catch (error) {
      console.log("error in the verify user ",error)
  }
}


const renewToken = (req, res) => {
   try {
    const refreshToken = req.cookies.refreshToken
    let exist = false;
    if (!refreshToken) {
        return res.json({ valid: false, message: 'No refresh token' })
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: 'Invalid Refresh Token' });
            } else {
                const accessToken = jwt.sign({ email: decoded.email },
                    process.env.ACCESS_TOKEN_KEY ,{ expiresIn: '1d' })
                res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 60 * 1000, path: "/", httpOnly: true, secure: true, sameSite: 'None' })
                exist = true;
            }
        })
    }

    return exist
   } catch (error) {
    console.log('error in renew',error)
   }
}



module.exports = verifyuser;
