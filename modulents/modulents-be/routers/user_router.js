const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/user_controller")

router.post("/userRegister", userControllers.register);
router.post("/userLogin", userControllers.login)

module.exports = router;
