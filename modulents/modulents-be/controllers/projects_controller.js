const projectModel = require("../models/ProjectsModel");
const projectValidator = require("./validators/projectValidator")

// how to split the controller for either admin or user?

const projectController = {
    listProjects: async (res, req) => {
        const userID = res.locals.authUserID

        try {
            const projects = await projectModel.find({ userID: userID });
            return res.status(200).json(projects);
        } catch (err) {
            console.error(">>> error getting projects: ", err);
            return res
                .status(400)
                .json({ msg: "An error occured, please try again" });
        }
    },

    // create a project to reflect to users / freelancers
    createProject: async (req, res) => {
        const userID = res.locals.authUserID

        const projectUpload = { ...req.body, userID: userID };

        // validate data
        const validationResult = projectValidator.createProjectSchema.validate(projectUpload)

        if (validationResult.error)
            return res.status(400).json(
                {
                    msg: validationResult.error
                })

        try {
            const projectRecord = await projectModel.create(
                {
                    projectName: projectUpload.projectName,
                    date: projectUpload.date,
                    teamSize: projectUpload.teamSize,
                    projectDescription: projectUpload.projectDescription,
                    skills: projectUpload.skills,
                    userID: projectUpload.userID
                });
            res.statusCode = 201;
            res.json({
                msg: "Project record created successfully"
            });
        } catch (err) {
            console.error(">>> error creating project: ", err);
            return res
                .status(400)
                .json({ msg: "An error occured, please try again" })
        }
    },

    deleteProject: async (req, res) => {
        const userID = res.locals.authUserID

        const projectUpload = { ...req.body, userID: userID }

        // validate project data

        const validationResult = projectValidator.deleteProjectSchema.validate(projectUpload);

        if (validationResult.error)
            return res.status(400).json({ msg: validationResult.error });

        try {
            await projectModel.deleteOne({ _id: req.body.id });
            res.statusCode = 200;
            res.json({
                msg: "project record deleted"
            })
        } catch (err) {
            console.info(">>> error deleting project: ", err);
            return res.status(400).json({ msg: "An error occurred, please try again" })
        }
    },

    updateProject: async (req, res) => {
        const userID = res.locals.authUserID;
        const data = req.body;
        let record = null;

        const projectUpload = { ...req.body, userID: userID }

        const validationResult = projectValidator.createProjectSchema.validate(projectUpload);

        if (validationResult.error)
            return res.status(400).json({ msg: validationResult.error });

        try {
            record = await projectModel.findById(req.params.recordID)
        } catch (err) {
            console.error(">>> update project record error: ", err)
            return res.status(400).json({ msg: "An error occurred, please try again" });
        }

        if (!record) {
            res.statusCode = 404;
            return res.json({ msg: "record not found" });
        }

        try {
            await projectModel.updateOne(
                {
                    _id: req.params.recordID,
                },
                {
                    projectName: data.projectName,
                    date: data.date,
                    teamSize: data.teamSize,
                    projectDescription: data.projectDescription,
                    skills: data.skills,
                }
            );
            return res.status(200).json({ msg: "Project record updated successfully" })
        } catch (err) {
            console.error(">>> update project error: ", err);
            return res.status(400).json({ msg: "An error occurred, please try again" });
        }
    }
}

module.exports = projectController
