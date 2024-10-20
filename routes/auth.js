const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const router = express.Router();

// تسجيل حساب جديد
router.post('/register', async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ full_name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');
        }

     
        res.status(200).json({ full_name: user.full_name, message: 'Login successful' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});





module.exports = router;
