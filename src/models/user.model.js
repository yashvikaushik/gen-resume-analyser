const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already exists"],
        required:true
    },

    email:{
        type:String,
        unique:[true,"username already exists"],
        required:true

    },

    password:{
        type:String,
        required:true
    }
})

// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) {
//         return next();
//     }

//     this.password = await bcrypt.hash(this.password, 10);

//     next();
// });

const userModel=mongoose.model("users",userSchema);

module.exports=userModel