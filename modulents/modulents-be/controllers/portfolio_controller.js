const portfolioModel = require("../models/UserPortfolioModel");
const portfolioValidator = require("./validators/portfolioValidator")

// how to split the controller for either admin or user?

const portfolioController = {
    listProjects: async (res, req) => {
        const userID = res.locals.authUserID

        try {
            const projects = await portfolioModel.find({ userID: userID });
            return res.status(200).json(projects);
        } catch (err) {
            console.error(">>> error getting projects: ", err);
            return res
                .status(400)
                .json({ msg: "An error occured, please try again" });
        }
    },

    // create a project to reflect to companies
    createPortfolio: async (req, res) => {
        const userID = res.locals.authUserID

        const portfolioUpload = { ...req.body, userID: userID };

        // validate data
        const validationResult = portfolioValidator.createPortfolioSchema.validate(portfolioUpload)

        if (validationResult.error)
            return res.status(400).json(
                {
                    msg: validationResult.error
                })

        try {
            const portfolioRecord = await portfolioModel.create(
                {
                    projectName: portfolioUpload.projectName,
                    date_completed: portfolioUpload.date_completed,
                    company: portfolioUpload.company,
                    projectDescription: portfolioUpload.projectDescription,
                    skills: portfolioUpload.skills,
                    url: portfolioUpload.url,
                });
            res.statusCode = 201;
            res.json({
                msg: "Portfolio record created successfully"
            });
        } catch (err) {
            console.error(">>> error creating record: ", err);
            return res
                .status(400)
                .json({ msg: "An error occurred, please try again" })
        }
    },

    deletePortfolio: async (req, res) => {
        const userID = res.locals.authUserID

        const portfolioUpload = { ...req.body, userID: userID }

        // validate project data

        const validationResult = portfolioValidator.deletePortfolioSchema.validate(portfolioUpload);
        if (validationResult.error)
            return res.status(400).json({ msg: validationResult.error });

        try {
            await portfolioModel.deleteOne({ _id: req.body.id });
            res.statusCode = 200;
            res.json({
                msg: "portfolio record deleted"
            })
        } catch (err) {
            console.info(">>> error deleting record: ", err);
            return res.status(400).json({ msg: "An error occurred, please try again" })
        }
    },

    updatePortfolio: async (req, res) => {
        const userID = res.locals.authUserID;
        const data = req.body;
        let record = null;

        const portfolioUpload = { ...req.body, userID: userID }

        const validationResult = portfolioValidator.createPortfolioSchema.validate(portfolioUpload);

        if (validationResult.error)
            return res.status(400).json({ msg: validationResult.error });

        try {
            record = await portfolioModel.findById(req.params.recordID)
        } catch (err) {
            console.error(">>> update portfolio record error: ", err)
            return res.status(400).json({ msg: "An error occurred, please try again" });
        }

        if (!record) {
            res.statusCode = 404;
            return res.json({ msg: "record not found" });
        }

        try {
            await portfolioModel.updateOne(
                {
                    _id: req.params.recordID,
                },
                {
                    projectName: portfolioUpload.projectName,
                    date_completed: portfolioUpload.date_completed,
                    company: portfolioUpload.company,
                    projectDescription: portfolioUpload.projectDescription,
                    skills: portfolioUpload.skills,
                    url: portfolioUpload.url,
                    userID: portfolioUpload.userID
                }
            );
            return res.status(200).json({ msg: "Portfolio record updated successfully" })
        } catch (err) {
            console.error(">>> update portfolio error: ", err);
            return res.status(400).json({ msg: "An error occurred, please try again" });
        }
    }
}

module.exports = portfolioController
