require("dotenv").config();
const connectToDB = require("./src/config/databse");
const app = require("./src/app");
const generateInterviewReport = require("./src/services/ai.service");
const { resume, selfDescription, jobDescription } = require("./src/services/temp");
const redis = require("./src/config/redis");

async function main() {
    await connectToDB();

    await redis.set("test-key", "hello");
    console.log("Redis connected successfully");

    await generateInterviewReport({ resume, selfDescription, jobDescription });

    app.listen(3000, () => {
        console.log("The server is running on port 3000");
    });
}

main().catch((err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
});