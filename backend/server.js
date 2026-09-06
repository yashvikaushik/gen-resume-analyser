require("dotenv").config()
const connectToDB=require("./src/config/databse")
const app=require("./src/app")
const invokeGeminiAI=require("./src/services/ai.service");

connectToDB()

invokeGeminiAI()

const redis = require("./src/config/redis");

redis.set("test-key", "hello")
    .then(() => console.log("Redis connected successfully"))
    .catch((err) => console.log("Redis error:", err));

app.listen(3000,()=>{
    console.log("The server is running on port 3000");
})