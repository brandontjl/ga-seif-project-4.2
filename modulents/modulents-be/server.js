const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const port = 3000;
const app = express();
const cors = require("cors");
const multer = require('multer') // remove if say not using file upload
const userRouter = require("./routers/user_router")
const projectsRouter = require("./routers/projects_router")
const portfolioRouter = require("./routers/portfolio_router")

// middleware to handle URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// handle cors pre-flight requests
app.use(
    cors({
        origin: "*",
    })
);
app.options("*", cors());

// API endpoint routes
app.use("/api/users", userRouter);

// // Company Admin endpoint routes
// app.use("/api/company", companyRouter); not needed any longer since merging both ends together

// Project Controller routes
app.use("/api/project", projectsRouter);

// Portfolio Controller routes
app.use("/api/portfolio", portfolioRouter);

app.get("/api/test", (req, res) => {
    res.json("server works!");
});

// LISTENER
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log("DB connected");

        // boot up app
        app.listen(port, () => {
            console.log("Modulents portal running on port: ", port);
        });
    })
    .catch((err) => {
        console.log("err when connecting: " + err);
    });

    // mongodb://localhost:27017/modulents