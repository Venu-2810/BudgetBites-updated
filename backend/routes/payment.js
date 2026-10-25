const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Payment = require("../models/Payment");

const MERCHANT_ID = process.env.MERCHANT_ID;
const MERCHANT_SECRET = process.env.MERCHANT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

// ✅ Create Payment
router.post("/create", async (req, res) => {
  try {
    const { order_id, amount, currency, first_name, last_name, email, phone, items } = req.body;

    // Save order
    await Payment.create({
      order_id,
      amount,
      currency,
      status: "pending",
      user_email: email,
      items,
    });

    // 🔐 Generate hash
    const md5Secret = crypto.createHash("md5").update(MERCHANT_SECRET).digest("hex").toUpperCase();
    const hashString = MERCHANT_ID + order_id + amount + currency + md5Secret;
    const hash = crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();

    res.json({
      sandbox: true,
      merchant_id: MERCHANT_ID,
      return_url: `${CLIENT_URL}/payment-success`,
      cancel_url: `${CLIENT_URL}/payment-cancel`,
      notify_url: `https://pseudoacademic-robin-prefinancial.ngrok-free.dev/api/payment/notify`,

      order_id,
      items,
      amount,
      currency,
      hash,
      first_name,
      last_name,
      email,
      phone,
      address: "Colombo",
      city: "Colombo",
      country: "Sri Lanka",
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Notify route
router.post("/notify", async (req, res) => {
  try {
    if (!req.body) {
      console.log("❌ No body received from PayHere");
      return res.status(400).send("No data");
    }

    const data = req.body;
    console.log("📩 PayHere Notify:", data);

    const { status_code, order_id } = data;

    if (status_code == 2) {
      await Payment.findOneAndUpdate({ order_id }, { status: "paid" });
      console.log(`✅ Order ${order_id} marked as PAID`);
    } else {
      await Payment.findOneAndUpdate({ order_id }, { status: "failed" });
      console.log(`❌ Order ${order_id} marked as FAILED`);
    }

    res.send("OK");
  } catch (err) {
    console.error("Notify error:", err.message);
    res.status(500).send("Error in notify");
  }
});


module.exports = router;
