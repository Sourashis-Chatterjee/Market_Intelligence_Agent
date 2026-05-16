const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
    // Expect: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not authorised. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user id to request so downstream handlers can use it
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Token invalid or expired. Please log in again." });
    }
};

module.exports = authUser;
