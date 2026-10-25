const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { addFood, getFoods, updateFood, deleteFood } = require("../controllers/foodControllers");

// Add food (creator only)
router.post("/add", authMiddleware, addFood);

// Get all foods
router.get("/", getFoods);

// Update food (creator only)
router.put("/:id", authMiddleware, updateFood);

// Delete food (creator only)
router.delete("/:id", authMiddleware, deleteFood);

module.exports = router;
