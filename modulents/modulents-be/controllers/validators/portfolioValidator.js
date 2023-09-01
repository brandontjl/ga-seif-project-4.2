const Joi = require("joi");

const portfolioValidator = {
    createPortfolioSchema: Joi.object({
        userID: Joi.string().required(),
        projectName: Joi.string().required(),
        date_completed: Joi.date().required(),
        company: Joi.string(),
        projectDescription: Joi.string().required(),
        skills: Joi.string().required(),
        // file how to store in validator?
    }),

    deletePortfolioSchema: Joi.object({
        id: Joi.string().required(),
        userID: Joi.string().required(),
    }),
};

module.exports = portfolioValidator;