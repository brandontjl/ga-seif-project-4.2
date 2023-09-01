const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userPortfolioSchema = new mongoose.Schema(
    {
        projectName: { type: String, required: true },
        date_completed: { type: Date, required: true },
        company: { type: Number },
        projectDescription: { type: String, required: true },
        skills: { type: String, required: true },
        url: { type: String },
        userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const Portfolio = mongoose.model("Portfolio", userPortfolioSchema);
module.exports = Portfolio