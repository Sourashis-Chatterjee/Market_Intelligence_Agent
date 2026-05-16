const express = require("express");
const { saveReport, getMyReports, getReportById } = require("../Controllers/reportController");
const authUser = require("../Middlewares/authUser");

const router = express.Router();

// All report routes require authentication
router.post("/save", authUser, saveReport);
router.get("/my", authUser, getMyReports);
router.get("/:id", authUser, getReportById);

module.exports = router;
