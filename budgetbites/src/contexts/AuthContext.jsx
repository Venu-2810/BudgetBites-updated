import { createContext, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ Register
  const register = async (email, password, role) => {
    return API.post("/auth/register", { email, password, role });
  };

  // ✅ Login
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const loggedInUser = { ...res.data.user, token: res.data.token }; 
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", res.data.token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};