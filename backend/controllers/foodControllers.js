const Food = require("../models/Food");

// Add food
exports.addFood = async (req, res) => {
  try {
    console.log("🔹 req.user.id:", req.user._id);
    console.log("🔹 req.user.role:", req.user.role);

    if (req.user.role !== "creator")
      return res.status(403).json({ message: "You must be a creator" });

    

    const food = await Food.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(food);
  } catch (err) {
    console.error("Add food error:", err);
    res.status(500).json({ message: "Failed to add food" });
  }
};

// Get all foods
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("createdBy", "email role");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update food
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    Object.assign(food, req.body);
    await food.save();
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete food
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    // Delete using Mongoose
    await food.deleteOne();

    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

