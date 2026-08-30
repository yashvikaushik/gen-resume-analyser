const jwt=require("jsonwebtoken")


/**
 * @route GET /api/auth/get-me
 * @description get logged in user
 * @access private
 */
async function authUser(req,res,next){
 const token=req.cookies.token
 if(!token){
    return res.status(401).json({message:"token not provided"})
 }
 const isTokenBlacklisted=await redis.get(token)
 if(isTokenBlacklisted){
    return res.status(401).json({message:"token is blacklisted,please login again"})
 }

try{
 const decoded=jwt.verify(token,process.env.JWT_SECRET)
 req.user=decoded
 next()
}catch(err){
   res.status(401).json({message:"Invalid token"})
}

}

module.exports={authUser}