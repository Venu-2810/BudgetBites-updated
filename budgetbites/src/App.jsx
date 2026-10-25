import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "/src/pages/Home.jsx";
import Register from "./components/auth/Register.jsx";
import Login from "./components/auth/Login.jsx";
import VerifiedSuccess from "./components/auth/VerifiedSuccess";

import PaymentSuccess from "./components/cart/PaymentSuccess.jsx";
import PaymentCancel from "./components/cart/PaymentCancel.jsx";
import FoodGrid from "./components/food/FoodGrid.jsx"; // Creator & User view
import AddFood from "./components/food/AddFood.jsx";   // Only Creator
import EditFood from "./pages/EditFood";
import CreatorDashboard from "./pages/CreatorDashboard"; 
import ExploreFoods from "./pages/ExploreFoods";
import MyOrders from "./pages/MyOrders";
import CreatorOrders from "./pages/CreatorOrders";
import { CartProvider } from "./contexts/CartContext";




function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-success/:token" element={<VerifiedSuccess />} />
        
        <Route path="/foods" element={<FoodGrid />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/edit-food/:id" element={<EditFood />} />
        <Route path="/creator" element={<CreatorDashboard />} />
        <Route path="/foods" element={<ExploreFoods />} />

        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/creator-orders" element={<CreatorOrders />} />

        
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />

        
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;
