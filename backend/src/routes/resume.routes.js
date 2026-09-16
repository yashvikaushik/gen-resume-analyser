const express = require("express");
const router = express.Router();

const uploadResume = require("../midlleware/upload.middleware");
const { uploadResume: uploadResumeController } = require("../controller/resume.controller");

router.post(
    "/upload",
    uploadResume.single("resume"),
    uploadResumeController
);

module.exports = router;