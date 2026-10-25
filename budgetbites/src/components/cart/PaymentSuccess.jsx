import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after few seconds (optional)
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your payment was successfully processed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
