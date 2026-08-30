const express=require("express");
const authRouter=express.Router()
const authController=require("../controller/auth.controller")
const authMiddleware=require("../midlleware/auth.middleware")

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


/**
 * @route GET /api/auth/get-me
 * @description get logged in user
 * @access private
 */

authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports=authRouter