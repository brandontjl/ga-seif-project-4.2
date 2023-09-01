require('dotenv').config()
const Joi = require('joi')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userModel = require("../models/UserModel")
const userValidators = require("./validators/userValidator")

const userControllers = {
    register: async (req, res) => {
        const data = req.body

        const validationResult = userValidators.register.validate(data) // this will be to validate the data that the user keyed in against the schema
        if (validationResult.error) {
            res.statusCode = 400

            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // this will be to search for users with the existing email
        // return error message if so (not unique)
        try {
            const user = await userModel.findOne({ email: data.email })
            if (user) {
                res.statusCode = 400
                return res.json({
                    msg: "Email has already been registered previously"
                })
            }
        } catch (err) {
            res.statusCode = 500
            return res.json({
                msg: "Failed to check for duplicates"
            })
        }

        // hashing algorithm to be applied to the provided password
        // pw hash will flow into mongo DB

        const hash = await bcrypt.hash(data.password, 10)

        // use userModel to create the new user
        try {
            await userModel.create({
                name: data.name,
                email: data.email,
                password: hash,
            })
        } catch (err) {
            res.statusCode = 500
            return res.json({
                msg: "Failed to create new user"
            })
        }

        // return response upon successful creation
        res.json({
            msg: "User created successfully"
        })
    },
    login: async (req, res) => {
        const data = req.body

        const validationResult = userValidators.loginSchema.validate(data)

        if (validationResult.error) {
            res.statusCode = 400
            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // check if the user exists or has registered via their email (unique identifier)
        // return login error status code 400 if not found

        let user = null
        try {
            user = await userModel.findOne({ email: data.email })
        } catch (err) {
            res.statusCode = 500
            return res.json({
                msg: "Error occured when fetching user"
            })
        }

        if (!user) {
            res.statusCode = 401
            return res.json({
                msg: "Login failed, email not registered"
            })
        }

        // bcrypt will be used to compare the entered password against the DB record in mongo and return 401 status error message

        const validLogin = await bcrypt.compare(data.password, user.password)

        if (!validLogin) {
            res.statusCode = 401
            return res.json({
                msg: "Login failed, incorrect password"
            })
        }
        // generate JWT using an external lib
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                // can pass in other user data as well - i.e., user type
            },
            process.env.APP_KEY,
            {
                expiresIn: "10 days",
                audience: "FE",
                issuer: "BE",
                subject: user._id.toString(), // _id from Mongoose is type of ObjectID,
            }
        )

        // return response with JWT
        res.json({
            msg: 'Success',
            token: token,
        })
    }
}

module.exports = userControllers