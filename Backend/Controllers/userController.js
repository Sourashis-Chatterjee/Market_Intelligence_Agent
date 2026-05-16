const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

// ── Helper: sign a JWT ─────────────────────────────────────────
const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/auth/register ────────────────────────────────────
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        // Check duplicate email
        const existing = await userModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: "An account with this email already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const user = new userModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        await user.save();

        // Issue token
        const token = signToken(user._id);

        return res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};



// ── POST /api/auth/login ───────────────────────────────────────
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // Find user
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Issue token
        const token = signToken(user._id);

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

// ── GET /api/auth/me  (verify token + return user) ────────────
const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("GetMe error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = { registerUser, loginUser, getMe };
