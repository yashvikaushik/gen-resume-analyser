const express = require("express");
const interviewRouter = express.Router();
const {
    generateReportController,
    getReportByIdController,
    getUserReportsController,
    deleteReportController
} = require("../controller/interviewReport.controller");
const { authUser, optionalAuth } = require("../midlleware/auth.middleware");
const uploadResume = require("../midlleware/upload.middleware");

/**
 * @route POST /api/interview/generate
 * @description Upload resume PDF and receive jobDescription/selfDescription inputs
 */
interviewRouter.post(
    "/generate",
    uploadResume.single("resume"),
    optionalAuth,
    generateReportController
);

/**
 * @route GET /api/interview/user/history
 * @description Get all past reports for the authenticated user
 */
interviewRouter.get("/user/history", authUser, getUserReportsController);
interviewRouter.get("/history", authUser, getUserReportsController);

/**
 * @route GET /api/interview/:id
 * @description Fetch a specific report by ID
 */
interviewRouter.get("/:id", getReportByIdController);

/**
 * @route DELETE /api/interview/:id
 * @description Delete a specific report by ID (authenticated)
 */
interviewRouter.delete("/:id", authUser, deleteReportController);

module.exports = interviewRouter;
