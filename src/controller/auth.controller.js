const userModel = require("../models/user.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const redis =require("../config/redis")

/**
 * @route POST
 * @description Register a new user expects username,email and password in the body 
 * @access public
 */
async function registerUserController(req,res){
   //destructuring the body
   const {username,email,password}=req.body;
   if(!username){
    return res.status(400).json({
        message:"Please provide username"
    })
   }
   if(!email){
    return res.status(400).json({
        message:"Please provide email"
    })
   }
   if(!password){
    return res.status(400).json({
        message:"Please provide password"
    })
   }

   const isUsernamePresent=await userModel.findOne(
    {$or:[{username},{email}]}
   );
   if(isUsernamePresent){
    return res.status(400).json({
        message:"Account already exists with this username or email "
    })
   }

   const hash=await bcrypt.hash(password,10);
   const user=await userModel.create(
    {
    username,
    email,
    password:hash
    }
   )

   const token=jwt.sign(
    {id:user._id,username:user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
    )

    res.cookie("token",token)
    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

/**
 * 
 * @route POST 
 * @description Login an existing user after successful vrification by password and email
 * @access public
 */
async function loginUserController(req,res){
 const {email,password}=req.body

 if(!email){
    return res.status(400).json({
        message:"Please provide email"
    })
   }
   if(!password){
    return res.status(400).json({
        message:"Please provide password"
    })
   }

 const isValidUser=await userModel.findOne({email})

 if(isValidUser==null){
    return res.status(400).json({
        message:"User not found"
    })
 }

 const isFoundPassword=await bcrypt.compare(password,isValidUser.password)

 if(!isFoundPassword){
  return res.status(400).json({
    message:"Please provide a valid password"
  })
 }


 const token=jwt.sign(
    {id: isValidUser._id,
    username: isValidUser.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:isValidUser._id,
            username:isValidUser.username,
            email:isValidUser.email
        }
    })


}

/**
 * 
 * @route POST 
 * @description Logout an existing user and blacklist the token occupied by it
 * @access public
 */

async function logoutUserController(req,res){
 const token =req.cookies.token
 if(!token){
    res.status(400).json({message:"User has not logged in"});
 }

 redis.set(token,"blacklisted")

 res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    });

}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController
}
  