const Joi = require("joi");

const projectValidator = {
    createProjectSchema: Joi.object({
        adminID: Joi.string().required(),
        projectName: Joi.string().required(),
        date: Joi.date().required(),
        teamSize: Joi.number().required(),
        projectDescription: Joi.string().required(),
        skills: Joi.string().required(),
        // file
    }),

    deleteProjectSchema: Joi.object({
        id: Joi.string().required(),
        adminID: Joi.string().required(),
    }),
};

module.exports = projectValidator;