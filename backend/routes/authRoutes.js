const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ✅ Gmail transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password, role, isVerified: false });
    await user.save();

    // Generate verification token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Send verification email → points to frontend
    const verifyLink = `${process.env.CLIENT_URL}/verify-success/${token}`;

    await transporter.sendMail({
      from: `"BudgetBites" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email",
      html: `<p>Hello ${user.email},</p>
             <p>Click the link below to verify your email:</p>
             <a href="${verifyLink}">✅ Verify Email</a>`,
    });

    res.json({ message: "Registered successfully. Check your email to verify." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Backend route for verification
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    // Respond with JSON instead of redirect
    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});



// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟡 Login attempt:", email);

    const user = await User.findOne({ email });
    console.log("🟢 User found:", user ? "YES" : "NO");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    console.log("🔵 Password match:", match);

    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
