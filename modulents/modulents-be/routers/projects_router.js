const express = require("express")
const router = express.Router()
// const multer = require('multer')
const projectController = require("../controllers/projects_controller")
const authMiddleware = require("../middlewares/auth_middleware")

router.get("/display", authMiddleware, projectController.listProjects);
router.post("/create", authMiddleware, projectController.createProject);
router.post("/delete/:recordID", authMiddleware, projectController.deleteProject);
router.post("/update/:recordID", authMiddleware, projectController.updateProject);

module.exports = router;