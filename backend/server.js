require("dotenv").config();
const connectToDB = require("./src/config/databse");
const app = require("./src/app");
const generateInterviewReport = require("./src/services/ai.service");
const { resume, selfDescription, jobDescription } = require("./src/services/temp");
const redis = require("./src/config/redis");

const PORT = process.env.PORT || 3000;

async function main() {
    await connectToDB();

    await redis.set("test-key", "hello");
    console.log("Redis connected successfully");

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Optional test run for AI report generator (runs in background without blocking server startup)
    // generateInterviewReport({ resume, selfDescription, jobDescription })
    //     .then((report) => console.log("AI Report Generator test passed"))
    //     .catch((err) => console.error("AI Report Generator test notice:", err.message));
}

main().catch((err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
});