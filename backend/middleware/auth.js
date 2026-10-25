const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authMiddleware = async (req, res, next) => {
  try {
    console.log("🔹 Incoming Authorization:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // get token after "Bearer "
    console.log("🔹 Token received in auth:", token);
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
