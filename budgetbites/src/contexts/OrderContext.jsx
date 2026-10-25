
import {
  createContext,
  useState,
  useContext,
  useCallback,
} from "react";

import axios from "axios";
import { AuthContext } from "./AuthContext";

export const OrderContext = createContext();

const BASE_URL = "http://localhost:3000/api/orders";

export const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [myOrders, setMyOrders] = useState([]);
  const [creatorOrders, setCreatorOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get authentication token
  const authHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Buyer: place an order from current cart items
  const placeOrder = async (items, deliveryAddress = "") => {
    const res = await axios.post(
      `${BASE_URL}/add`,
      {
        items,
        deliveryAddress,
      },
      authHeaders()
    );

    return res.data;
  };

  // Buyer: fetch my orders
  // silent = true means automatic refresh without loading indicator
  const fetchMyOrders = useCallback(
    async ({ silent = false } = {}) => {
      if (!user) return;

      // Show loading only during the initial fetch
      if (!silent) {
        setLoading(true);
      }

      try {
        const res = await axios.get(
          `${BASE_URL}/my-orders`,
          authHeaders()
        );

        // Update buyer order list with latest status
        setMyOrders(res.data);
      } catch (err) {
        console.error(
          "Fetch my orders error:",
          err
        );
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [user]
  );

  // Creator: fetch incoming orders
  const fetchCreatorOrders = useCallback(async () => {
    if (!user || user.role !== "creator") return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/creator-orders`,
        authHeaders()
      );

      setCreatorOrders(res.data);
    } catch (err) {
      console.error(
        "Fetch creator orders error:",
        err
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Creator: update order status
  const updateOrderStatus = async (orderId, status) => {
    const res = await axios.put(
      `${BASE_URL}/${orderId}/status`,
      {
        status,
      },
      authHeaders()
    );

    // Update creator order list immediately
    setCreatorOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? res.data
          : order
      )
    );

    return res.data;
  };

  return (
    <OrderContext.Provider
      value={{
        myOrders,
        creatorOrders,
        loading,
        placeOrder,
        fetchMyOrders,
        fetchCreatorOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () =>
  useContext(OrderContext);
