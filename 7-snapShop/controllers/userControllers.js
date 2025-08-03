const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const registerUser = async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            throw new Error('Name, email and password are required');
        }
    
        const { name, email, password, role = 'user' } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' , user });
    } catch (error) {
        if (error.message === 'Name, email and password are required') {
            res.status(400).json({ message: error.message });
        }else if (error.code === 11000) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
    
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user._id , role: user.role  , email : user.email}, process.env.JWT_SECRET , {expiresIn: process.env.JWT_EXPIRES});
        res.status(200).json({ message: 'Login successful' , token });
    } catch (error) {
        if (error.message === 'Invalid email') {
            res.status(400).json({ message: error.message });
        }else if (error.message === 'Invalid password') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = { registerUser , loginUser };