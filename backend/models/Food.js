const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);
