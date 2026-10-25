
const Order = require("../models/Order");
const Food = require("../models/Food");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials not configured");
      return;
    }

    await transporter.sendMail({
      from: `"BudgetBites" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

const STATUS_LABELS = {
  pending: "Order Placed",
  accepted: "Accepted by Creator",
  preparing: "Preparing your food",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Buyer: place order
exports.placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    const groups = {};

    // Verify each food using the database
    for (const item of items) {
      const foodId = item._id || item.id;

      if (!foodId) {
        return res.status(400).json({
          message: `Food ID missing for ${item.name || "an item"}.`,
        });
      }

      // Demo foods have numeric IDs and are not MongoDB food records
      if (!/^[a-fA-F0-9]{24}$/.test(String(foodId))) {
        return res.status(400).json({
          message: `"${item.name || "This food"}" is a demo food, not a creator's saved food. Please order a food added by a creator.`,
        });
      }

      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(400).json({
          message: `"${item.name || "This food"}" was not found in the database. Please refresh the food list and try again.`,
        });
      }

      if (!food.createdBy) {
        return res.status(400).json({
          message: `No creator is assigned to "${food.name}".`,
        });
      }

      const creatorId = food.createdBy.toString();

      if (!groups[creatorId]) {
        groups[creatorId] = [];
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for "${food.name}".`,
        });
      }

      // Use database values, not client-supplied price/name
      groups[creatorId].push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity,
      });
    }

    const createdOrders = [];

    // Create one order for each creator
    for (const creatorId of Object.keys(groups)) {
      const groupItems = groups[creatorId];

      const totalAmount = groupItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = await Order.create({
        buyer: req.user._id,
        creator: creatorId,
        items: groupItems,
        totalAmount,
        deliveryAddress: deliveryAddress || "",
        status: "pending",
      });

      createdOrders.push(order);

      // Notify creator by email (if configured)
      const creator = await User.findById(creatorId);

      if (creator?.email) {
        await sendMail(
          creator.email,
          "New Order Received - BudgetBites",
          `<p>Hello,</p>
           <p>You have a new order from ${req.user.email || "a buyer"}.</p>
           <p><strong>Items:</strong> ${groupItems
             .map((item) => `${item.name} x ${item.quantity}`)
             .join(", ")}</p>
           <p><strong>Total:</strong> Rs. ${totalAmount}</p>
           <p>Please open your Creator Dashboard to manage the order.</p>`
        );
      }
    }

    if (createdOrders.length === 0) {
      return res.status(400).json({
        message: "No valid creator foods were found in this cart.",
      });
    }

    return res.status(201).json({
      message: "Order placed successfully.",
      orders: createdOrders,
    });
  } catch (err) {
    console.error("Place order error:", err);

    return res.status(500).json({
      message: "Failed to create order.",
      error: err.message,
    });
  }
};

// Buyer: get their orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
    })
      .populate("creator", "email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error("Fetch buyer orders error:", err);

    return res.status(500).json({
      message: "Failed to fetch your orders.",
    });
  }
};

// Creator: get incoming orders
exports.getCreatorOrders = async (req, res) => {
  try {
    if (req.user.role !== "creator") {
      return res.status(403).json({
        message: "You must be logged in as a creator.",
      });
    }

    const orders = await Order.find({
      creator: req.user._id,
    })
      .populate("buyer", "email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error("Fetch creator orders error:", err);

    return res.status(500).json({
      message: "Failed to fetch incoming orders.",
    });
  }
};

// Creator: update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!STATUS_LABELS[status]) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    if (req.user.role !== "creator") {
      return res.status(403).json({
        message: "Only creators can update order status.",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("buyer", "email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot update this order.",
      });
    }

    order.status = status;
    await order.save();

    if (order.buyer?.email) {
      await sendMail(
        order.buyer.email,
        `BudgetBites Order Update - ${STATUS_LABELS[status]}`,
        `<p>Hello,</p>
         <p>Your order status has been updated to:</p>
         <h3>${STATUS_LABELS[status]}</h3>
         <p>Thank you for ordering with BudgetBites!</p>`
      );
    }

    return res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);

    return res.status(500).json({
      message: "Failed to update order status.",
    });
  }
};
