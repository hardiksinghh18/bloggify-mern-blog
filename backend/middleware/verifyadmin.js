const Register = require('../models/usermodel');

const verifyadmin = async (req, res, next) => {
    try {
        // req.email is populated by verifyuser middleware
        const user = await Register.findOne({ email: req.email });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        console.error("Error in verifyadmin middleware:", error);
        res.status(500).json({ message: "Server error checking permissions." });
    }
};

module.exports = verifyadmin;
