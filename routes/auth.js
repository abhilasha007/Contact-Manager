// FOR LOGGING IN/ check logged in user
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const User = require('../models/User');

// @route  GET api/auth
// @desc   Get logged in user
// @access Private --> we need middleware and pass it as second parameter
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    // res.send('Get logged in user');
});

// @route  POST api/auth
// @desc   Auth user & get token
// @access Public
router.post('/', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res)=> {
        // errors if any from exp-validator
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //extracting email, pass
        const {email, password} = req.body;
        try {
            // finding user in DB by email
            let user = await User.findOne({ email });
            //if user does not exist
            if(!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            //matching the password
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({msg: 'Invalid Credentials'})
            }

            //jwt:--
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload, 
                config.get('jwtSecret'),
                {
                    expiresIn: 360000
                }, 
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                }
            );
            //
        } catch(err){
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;