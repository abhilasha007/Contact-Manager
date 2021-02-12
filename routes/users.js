// Register User Route
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @route    POST api/users
// @desc     Register a user
// @access   Public
// router.post('path', [*validator*], callback func);
router.post('/', [
    check('name', 'Please add your name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters ').isLength({min: 6}),
],
async (req, res)=> {
    //errors if any from validator
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //extracting name, email, pass
    const {name, email, password} = req.body;
    try {
        //finding in DB by email
        let user = await User.findOne({email});

        //warning if user already exists
        if(user){
            return res.status(400).json('User already exists');
        }
        // else making a new user from info ext.
        user = new User({
            name,
            email,
            password
        })

        //bcrypting the password so we'll have encrypted pass in our DB
        const salt = await bcrypt.genSalt(10); //
        user.password = await bcrypt.hash(password, salt); //
        
        //saving the user in DB
        await user.save();
        // res.send('User saved');

        //jwt :-
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000}, 
            (err, token) => {
                if(err) throw err;  
                res.json({ token });
            }
        );
        //
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;