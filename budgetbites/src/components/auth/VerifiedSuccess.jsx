import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifiedSuccess = () => {
  const { token } = useParams(); // grabs token from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("❌ No verification token found.");
        return;
      }
      try {
        await axios.get(`http://localhost:3000/api/auth/verify-email/${token}`);
        setMessage("✅ Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000); // auto-redirect to login
      } catch (err) {
        console.error(err);
        setMessage("❌ Verification failed or token expired.");
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>{message}</h1>
      {message.includes("successfully") && (
        <Link to="/login">
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default VerifiedSuccess;
