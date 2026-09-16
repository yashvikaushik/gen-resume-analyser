const jwt = require("jsonwebtoken");
const redis = require("../config/redis");

/**
 * @description Strict authentication middleware - requires valid token
 */
async function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "token not provided" });
    }
    const isTokenBlacklisted = await redis.get(token);
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "token is blacklisted, please login again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

/**
 * @description Optional authentication middleware - attaches req.user if token is present and valid
 */
async function optionalAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return next();
    }

    try {
        const isTokenBlacklisted = await redis.get(token);
        if (isTokenBlacklisted) {
            return next();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // Silently proceed as guest if token is invalid
        req.user = null;
    }
    next();
}

module.exports = {
    authUser,
    optionalAuth
};