const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolio_controller");
const authMiddleware = require("../middlewares/auth_middleware");

router.get("/display", authMiddleware, portfolioController.listProjects);
router.post("/create", authMiddleware, portfolioController.createPortfolio);
router.post("/update/:recordID", authMiddleware, portfolioController.updatePortfolio);
router.post("/deleteRecord/:recordID", authMiddleware, portfolioController.deletePortfolio);

module.exports = router;