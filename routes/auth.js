const express = require('express');
require('dotenv').config();

const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

//Route:1 //Creating a new User using POST:./auth/createuser.No login Required//
router.post('/createuser',
    //conditions for creating a user
    body('email', "Invalid Email").isEmail(),
    body('password', "Password must be atleast of 5 characters").isLength({ min: 5 }),
    body('name').isLength({ min: 3 }).withMessage("Name is required"),


    async (req, res) => {
        // console.log(req.body);
        //check whether the user with sam email exist already.
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        try {

            // Check whether the user with the same email exists already
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "Sorry, a user with this email already exists" });
            }
            const salt = await bcrypt.genSalt(10);
            const securedpass = await bcrypt.hash(req.body.password, salt);
            //if not exist then create a new user//
            user = await User.create({
                name: req.body.name,
                password: securedpass,
                email: req.body.email,
            });
            //return res.status(201).json(user); // Return created user with 201 status

            const data = {
                user: user.id
            }

            const auth_token = jwt.sign(data, JWT_SECRET);
            res.json({ auth_token })

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "An error occurred while creating the user" });
        }
    });


//Route:2//Authenticate a User using: POST "/api/auth/login"//
router.post('/login', [
    //condition for login a user//
    body('email', "Invalid Email").isEmail(),
    body('password', "Password cannot be empty").exists(),
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;

    // Check whether the user with exists or not//
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct Credentials" });
        }
        const password_compare = await bcrypt.compare(password, user.password);
        if (!password_compare) {
            return res.status(400).json({ error: "Please try to login with correct Credentials" });
        }


        //If password is correct payload is sent//
        /*    const payload = {
                user: {
                    id: user.id
                }
            }*/

        //If password is correct payload is sent//
        const data = {
            user: user.id
        }

        const auth_token = jwt.sign(data, JWT_SECRET);
        res.json({ auth_token })


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server erroror" });

    }
});



//Route:3//Get logged in user details  using: POST "/api/auth/getuser"//
router.post('/getuser', fetchuser, async (req, res) => {

    //fetchuser middleware is used to send data of the exisiting user
    try {
        const userid = req.user;
        const user = await User.findById(userid).select('-password');
        //console.log(user)
        res.send(user);

    } catch (erroror) {
        //console.error(error);
        //return res.send(req.header)
        return res.status(500).json({ error: "Internal Server Error" });

    }

})

module.exports = router;