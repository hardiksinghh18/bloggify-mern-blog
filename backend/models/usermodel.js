require('dotenv').config();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const slugify = require('../utils/slugify')

async function generateUniqueUsername(email, name, userId = null) {
  let baseUsername = "";
  if (email) {
    baseUsername = email.split('@')[0].toLowerCase().replace(/[^\w.-]+/g, '');
  }
  if (!baseUsername && name) {
    baseUsername = slugify(name);
  }
  if (!baseUsername) {
    baseUsername = "user";
  }
  
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const query = { username };
    if (userId) {
      query._id = { $ne: userId };
    }
    const existingUser = await mongoose.models.Register.findOne(query);
    if (!existingUser) {
      return username;
    }
    username = `${baseUsername}-${counter}`;
    counter++;
  }
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    googleId: {
        type: String
    },
    profileImage: {
        type: String
    },
    bio: {
        type: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register'
    }]
})

userSchema.pre('validate', async function (next) {
    if (this.email && (this.isModified('email') || !this.username)) {
        this.username = await generateUniqueUsername(this.email, this.name, this._id);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ email: this.email }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '1d' });
        await this.save();

        return token
    } catch (error) {
        console.log(error)
    }
}
userSchema.methods.generateRefreshToken = async function () {
    try {
        const refreshToken = jwt.sign({ email: this.email }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '30d' });
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
