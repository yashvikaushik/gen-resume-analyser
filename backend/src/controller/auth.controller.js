const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");

/**
 * @route POST
 * @description Register a new user expects username,email and password in the body 
 * @access public
 */
async function registerUserController(req, res) {
    //destructuring the body
    const { username, email, password } = req.body;
    if (!username) {
        return res.status(400).json({
            message: "Please provide username"
        });
    }
    if (!email) {
        return res.status(400).json({
            message: "Please provide email"
        });
    }
    if (!password) {
        return res.status(400).json({
            message: "Please provide password"
        });
    }

    const isUsernamePresent = await userModel.findOne(
        { $or: [{ username }, { email }] }
    );
    if (isUsernamePresent) {
        return res.status(400).json({
            message: "Account already exists with this username or email "
        });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create(
        {
            username,
            email,
            password: hash
        }
    );

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * 
 * @route POST 
 * @description Login an existing user after successful vrification by password and email
 * @access public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Please provide email"
        });
    }
    if (!password) {
        return res.status(400).json({
            message: "Please provide password"
        });
    }

    const isValidUser = await userModel.findOne({ email });

    if (isValidUser == null) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    const isFoundPassword = await bcrypt.compare(password, isValidUser.password);

    if (!isFoundPassword) {
        return res.status(400).json({
            message: "Please provide a valid password"
        });
    }

    const token = jwt.sign(
        {
            id: isValidUser._id,
            username: isValidUser.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: isValidUser._id,
            username: isValidUser.username,
            email: isValidUser.email
        }
    });
}

/**
 * @route POST
 * @description Login or Register a user via OAuth (Google / GitHub)
 * @access public
 */
async function oauthAuthController(req, res) {
    try {
        const { email, name, displayName, uid, provider = "OAuth" } = req.body;

        const effectiveEmail = email || (uid ? `${uid}@oauth.local` : null);

        if (!effectiveEmail) {
            return res.status(400).json({
                message: "Email or UID is required for login"
            });
        }

        let user = await userModel.findOne({ email: effectiveEmail });

        if (!user) {
            // Generate a clean username from displayName or email
            const baseName = (displayName || name || effectiveEmail.split("@")[0])
                .replace(/[^a-zA-Z0-9]/g, "_")
                .toLowerCase();
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            let uniqueUsername = `${baseName}_${randomSuffix}`;

            // Check if unique username already exists
            const existingUser = await userModel.findOne({ username: uniqueUsername });
            if (existingUser) {
                uniqueUsername = `${baseName}_${Date.now().toString().slice(-6)}`;
            }

            const randomPassword = await bcrypt.hash(uid || Math.random().toString(36), 10);

            user = await userModel.create({
                username: uniqueUsername,
                email: effectiveEmail,
                password: randomPassword
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token);

        return res.status(200).json({
            message: `${provider} login successful`,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("OAuth Auth error:", error);
        return res.status(500).json({
            message: "Failed to authenticate",
            error: error.message
        });
    }
}

/**
 * 
 * @route POST 
 * @description Logout an existing user and blacklist the token occupied by it
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "User has not logged in" });
    }

    await redis.set(token, "blacklisted");

    res.clearCookie("token");

    return res.status(200).json({
        message: "User logged out successfully"
    });
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                name: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user", error: error.message });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    googleAuthController: oauthAuthController,
    oauthAuthController,
    logoutUserController,
    getMeController
};