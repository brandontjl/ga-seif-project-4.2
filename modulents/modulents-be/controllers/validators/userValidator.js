const Joi = require('joi');

const validators = {
    register: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(3).email().required(), // email will check for email syntax @
        password: Joi.string().min(6).required(),
    }),

    loginSchema: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })

}

module.exports = validators