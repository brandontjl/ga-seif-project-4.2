const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companyProjectsSchema = new mongoose.Schema(
    {
        projectName: { type: String, required: true },
        date: { type: Date, required: true },
        teamSize: { type: Number, required: true },
        projectDescription: { type: String, required: true },
        skills: { type: String, required: true },
        userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            required: true,
        },
    },
    {
        timestamps: true
    },
    {
        applicants: [String]
    }
)

const Projects = mongoose.model("Projects", companyProjectsSchema);
module.exports = Projects