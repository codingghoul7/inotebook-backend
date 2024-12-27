const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User");

//Creating a new User using POST:./auth/createuser.No login Required//
router.post('/createuser',
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
            //if not exist then create a new user//
            user = await User.create({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
            });
            return res.status(201).json(user); // Return created user with 201 status
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred while creating the user" });
        }
    });



module.exports = router;