const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const jwt = require("jsonwebtoken");

// ✅ Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get all foods
router.get("/", async (req, res) => {
  const foods = await Food.find().populate("creator", "email role");
  res.json(foods);
});

// Add food (creator only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "creator") return res.status(403).json({ message: "Only creators can add food" });
  const food = new Food({ ...req.body, creator: req.user.id });
  await food.save();
  res.json(food);
});

// Update food
router.put("/:id", auth, async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: "Food not found" });
  if (food.creator.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

  Object.assign(food, req.body);
  await food.save();
  res.json(food);
});

// Delete food
router.delete("/:id", auth, async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: "Food not found" });
  if (food.creator.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

  await food.remove();
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
