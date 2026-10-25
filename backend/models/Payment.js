const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  amount: Number,
  currency: String,
  user_email: String,
  items: String,
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Payment", paymentSchema);
