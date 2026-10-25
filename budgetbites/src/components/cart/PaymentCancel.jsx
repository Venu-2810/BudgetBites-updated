import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          ❌ Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Please try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
