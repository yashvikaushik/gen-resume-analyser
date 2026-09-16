const mongoose =require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to database")
    }

    catch(err){
        console.log("Database connection failed:", err.message);
        throw err;
    }

}

module.exports=connectDB