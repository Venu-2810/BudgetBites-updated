import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useOrders } from "../../contexts/OrderContext";
import { formatPrice } from "../../utils/helpers";

const CartSummary = () => {
  const { user } = useContext(AuthContext);

  const {
    items,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();

  const { placeOrder } = useOrders();

  // Keep the remaining existing component code below.


  const [payHereLoaded, setPayHereLoaded] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (window.payhere) {
      setPayHereLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;

    script.onload = () => setPayHereLoaded(true);
    script.onerror = () => {
      console.error("Could not load PayHere script.");
    };

    document.body.appendChild(script);

    return () => {
      // Do not remove the script; other components may use it
    };
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0 || checkingOut) return;

    if (!user) {
      alert("Please login before checkout.");
      return;
    }

    if (!payHereLoaded || !window.payhere) {
      alert("PayHere is still loading. Please try again.");
      return;
    }

    setCheckingOut(true);

    try {
      // Step 1: Create the food order first.
      // If this fails, do not start payment.
      const orderResult = await placeOrder(items);

      if (
        !orderResult ||
        !Array.isArray(orderResult.orders) ||
        orderResult.orders.length === 0
      ) {
        throw new Error("The backend did not create an order.");
      }

      // Step 2: Create the PayHere payment request
      const orderId = "Order_" + Date.now();
      const amount = Number(getTotalPrice()).toFixed(2);

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:3000";

      const response = await fetch(
        `${backendUrl}/api/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            amount,
            currency: "LKR",
            first_name: user?.firstName || "Test",
            last_name: user?.lastName || "User",
            email: user?.email || "test@example.com",
            phone: user?.phone || "0771234567",
            items: items.map((item) => item.name).join(", "),
          }),
        }
      );

      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(
          paymentData.message || "Could not create payment."
        );
      }

      // Step 3: Start PayHere
      window.payhere.startPayment(paymentData);

      // Keep cart intact until payment is confirmed.
      // Do not clear the cart here.
    } catch (err) {
      console.error(
        "Checkout failed:",
        err.response?.data || err.message || err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        "Checkout failed. Please try again.";

      alert(message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="fixed right-5 bottom-5 w-80 bg-gradient-to-br from-green-100 via-white to-green-50 rounded-2xl shadow-2xl p-5 border border-green-200">
      <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
        <span className="text-xl">🛒</span> Shopping Cart
      </h2>

      {items.length === 0 && (
        <p className="text-gray-500 text-center py-6 italic">
          Your cart is empty
        </p>
      )}

      <div className="max-h-60 overflow-y-auto mt-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-3 border-b"
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {item.name}
              </span>

              <span className="text-sm text-gray-500">
                {formatPrice(item.price)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(
                    item.id,
                    Math.max(1, item.quantity - 1)
                  )
                }
                className="bg-red-100 hover:bg-red-200 text-red-600 px-2 rounded"
                disabled={checkingOut}
              >
                -
              </button>

              <span className="font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
                className="bg-green-100 hover:bg-green-200 text-green-600 px-2 rounded"
                disabled={checkingOut}
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 ml-2"
                disabled={checkingOut}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <>
          <h3 className="text-right font-bold text-lg mt-3 text-green-700">
            Total: {formatPrice(getTotalPrice())}
          </h3>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium shadow-md transition"
          >
            {checkingOut
              ? "Processing..."
              : `Checkout (${formatPrice(getTotalPrice())})`}
          </button>
        </>
      )}
    </div>
  );
};

export default CartSummary;
