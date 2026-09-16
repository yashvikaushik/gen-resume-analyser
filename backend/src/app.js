const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

/* Routes */
const authRouter = require("./routes/auth.routes");
const resumeRouter = require("./routes/resume.routes");
const interviewRouter = require("./routes/interviewReport.routes");

/* Mount Routes */
app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/ai", interviewRouter); // Convenient alias

module.exports = app;
