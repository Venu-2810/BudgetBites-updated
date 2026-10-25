const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  placeOrder,
  getMyOrders,
  getCreatorOrders,
  updateOrderStatus,
} = require("../controllers/orderControllers");

// Buyer places an order from their cart
router.post("/add", authMiddleware, placeOrder);

// Buyer views their own orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Creator views incoming orders for their food
router.get("/creator-orders", authMiddleware, getCreatorOrders);

// Creator updates an order's status (accept / preparing / out for delivery / delivered)
router.put("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;