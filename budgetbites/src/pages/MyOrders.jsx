
import React, {
  useContext,
  useEffect,
} from "react";

import { AuthContext } from "../contexts/AuthContext";
import { useOrders } from "../contexts/OrderContext";

import "./MyOrders.css";

const STEPS = [
  "pending",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
];

const STEP_LABELS = {
  pending: "Order Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const MyOrders = () => {
  const { user } = useContext(AuthContext);

  const {
    myOrders,
    fetchMyOrders,
    loading,
  } = useOrders();

  // Fetch orders and automatically refresh status
  useEffect(() => {
    // Fetch orders when the page opens
    fetchMyOrders();

    // Refresh order status every 5 seconds
    const intervalId = setInterval(() => {
      fetchMyOrders({
        silent: true,
      });
    }, 5000);

    // Stop refreshing when leaving the page
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchMyOrders]);

  // If buyer is not logged in
  if (!user) {
    return (
      <div className="my-orders">
        <h1>📦 My Orders</h1>

        <p>
          Please login to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h1>📦 My Orders</h1>

      {loading && (
        <p>Loading your orders...</p>
      )}

      {!loading && myOrders.length === 0 && (
        <p>
          You haven't placed any orders yet.
        </p>
      )}

      <div className="order-list">
        {myOrders.map((order) => {
          const isCancelled =
            order.status === "cancelled";

          const activeIndex =
            STEPS.indexOf(order.status);

          return (
            <div
              key={order._id}
              className="order-card"
            >
              <div className="order-header">
                <span>
                  Order #
                  {order._id
                    .slice(-6)
                    .toUpperCase()}
                </span>

                <span
                  className={`status-badge status-${order.status}`}
                >
                  {isCancelled
                    ? "Cancelled"
                    : STEP_LABELS[order.status]}
                </span>
              </div>

              <ul className="order-items">
                {order.items.map(
                  (item, idx) => (
                    <li key={idx}>
                      {item.name} x
                      {item.quantity} — Rs.{" "}
                      {item.price *
                        item.quantity}
                    </li>
                  )
                )}
              </ul>

              <p className="order-total">
                Total: Rs.{" "}
                {order.totalAmount}
              </p>

              {/* Order progress tracker */}
              {!isCancelled && (
                <div className="progress-tracker">
                  {STEPS.map(
                    (step, idx) => (
                      <div
                        key={step}
                        className={`progress-step ${
                          idx <= activeIndex
                            ? "done"
                            : ""
                        }`}
                      >
                        <span className="dot" />

                        <span className="label">
                          {STEP_LABELS[step]}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
