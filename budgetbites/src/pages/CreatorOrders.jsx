import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useOrders } from "../contexts/OrderContext";
import "./CreatorOrders.css";

// Only one "next step" button is shown at a time, matching the real
// life flow: Accept -> Preparing -> Out for Delivery -> Delivered
const NEXT_STATUS = {
  pending: { next: "accepted", label: "✅ Accept Order" },
  accepted: { next: "preparing", label: "👨‍🍳 Start Preparing" },
  preparing: { next: "out_for_delivery", label: "🛵 Out for Delivery" },
  out_for_delivery: { next: "delivered", label: "📦 Mark Delivered" },
};

const STATUS_LABELS = {
  pending: "New Order",
  accepted: "Accepted",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const CreatorOrders = () => {
  const { user } = useContext(AuthContext);
  const { creatorOrders, fetchCreatorOrders, updateOrderStatus, loading } = useOrders();

  useEffect(() => {
    fetchCreatorOrders();
  }, [fetchCreatorOrders]);

  if (!user || user.role !== "creator") {
    return (
      <div className="creator-orders">
        <h1>🧾 Incoming Orders</h1>
        <p>Only creators can view this page.</p>
      </div>
    );
  }

  const handleUpdate = async (id, next) => {
    try {
      await updateOrderStatus(id, next);
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="creator-orders">
      <h1>🧾 Incoming Orders</h1>

      {loading && <p>Loading orders...</p>}
      {!loading && creatorOrders.length === 0 && <p>No orders yet.</p>}

      <div className="order-list">
        {creatorOrders.map((order) => {
          const nextStep = NEXT_STATUS[order.status];
          return (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                <span className={`status-badge status-${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <p className="buyer-email">Buyer: {order.buyer?.email}</p>

              <ul className="order-items">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x{item.quantity} — Rs. {item.price * item.quantity}
                  </li>
                ))}
              </ul>

              <p className="order-total">Total: Rs. {order.totalAmount}</p>

              {order.deliveryAddress && (
                <p className="delivery-address">📍 {order.deliveryAddress}</p>
              )}

              {nextStep && (
                <button
                  className="update-btn"
                  onClick={() => handleUpdate(order._id, nextStep.next)}
                >
                  {nextStep.label}
                </button>
              )}

              {order.status === "delivered" && (
                <p className="delivered-note">✅ This order has been delivered.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatorOrders;