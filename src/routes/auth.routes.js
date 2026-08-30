const express=require("express");
const authRouter=express.Router()
const authController=require("../controller/auth.controller")

/**
 * @route POST
 * @description Register a new user
 * @access public
 */

authRouter.post("/register",authController.registerUserController)

/**
 * @route POST
 * @description login a registered user
 * @access public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route POST
 * @description logout a registered user and blacklist the token
 * @access public
 */
authRouter.get("/logout",authController.logoutUserController)



module.exports=authRouter