const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  name: String,
  price: Number,
  quantity: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },
  deliveryAddress: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);