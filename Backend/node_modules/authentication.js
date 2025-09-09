const jwt = require("jsonwebtoken");

const middlejwt = (req, res, next) => {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    // Handle case where header might be in different cases
    const tokenParts = authHeader.split(' ');

    // More flexible token format check
    if (tokenParts.length < 2) {
        return res.status(401).json({ error: "Invalid token format. Expected: 'Bearer <token>'" });
    }

    // Get the token (could be "Bearer token" or just "token")
    const token = tokenParts.length === 2 ? tokenParts[1] : authHeader;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Verify the JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user information to the request object
        next();
    } catch (err) {
        console.log("JWT Verification Error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET); // Added expiration
};

module.exports = { middlejwt, generateToken };