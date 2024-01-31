const User = require('../models/user');
const jwt = require('jsonwebtoken')
const debug = require('debug')('server:app')
const maxAge = 365 * 24 * 60 * 60 * 1000; //365 days

const createToken = (id) => {
    const secretKey = "Mnet2024"
    const options = { expiresIn: '365d' }
    return jwt.sign({ id }, secretKey, options)
}

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const response = {}
    try {
        const newUser = await User.create({
            name, email, password
        });
        // const token = createToken(newUser._id);
        // const options = {
        //     httpOnly:true,
        //     maxAge: maxAge
        // }
        // 
        // res.cookie("ftune", token,options)
        response.success = "User created successfully"
        res.status(201).json(newUser._id);
    } catch (err) {
        debug(err)
        if (err.code === 11000) {
            response.error = "Email is already registered"
            res.status(400).json(response);
            return;
        }
        response.error = err
        res.status(500).json(response);
    }
}


const login = async (req, res) => {
    const { email, password } = req.body
    const response = {}
    try {
        const user = await User.login(email, password)
        debug(user)
        const token = createToken(user._id);
        const options = { secure: true, domain:'1stepcure.com', sameSite: 'None' };
        res.cookie("ftune", token, options)
        response.user = { user: user._id }
        res.status(200).json({ user: user._id })
    } catch (err) {
        response.Error = err.Error;
        res.status(400).json(response);
    }
}
module.exports = { signup, login }