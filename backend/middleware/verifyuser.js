require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyuser = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            const renewed = await renewToken(req, res);
            if (renewed) {
                return next();
            } else {
                // renewToken already sent a response if it returned false
                return;
            }
        } else {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ valid: false, message: "Invalid Token" });
                } else {
                    req.email = decoded.email;
                    return next();
                }
            });
        }
    } catch (error) {
        console.log("error in the verify user ", error);
        return res.status(500).json({ valid: false, message: "Server Error" });
    }
};

const renewToken = (req, res) => {
    return new Promise((resolve) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ valid: false, message: 'No refresh token' });
            return resolve(false);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ valid: false, message: 'Invalid Refresh Token' });
                return resolve(false);
            } else {
                const accessToken = jwt.sign({ email: decoded.email },
                    process.env.ACCESS_TOKEN_KEY, { expiresIn: '1d' });
                
                res.cookie('accessToken', accessToken, { 
                    maxAge: 24 * 60 * 60 * 1000, 
                    path: "/", 
                    httpOnly: true, 
                    secure: true, 
                    sameSite: 'None' 
                });
                
                req.email = decoded.email; // Set email for next middleware/route
                return resolve(true);
            }
        });
    });
};

module.exports = verifyuser;
