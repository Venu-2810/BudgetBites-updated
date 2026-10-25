import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { FoodProvider } from './contexts/FoodContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import './styles/globals.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <FoodProvider>
      <CartProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
    </CartProvider>
    </FoodProvider>  
    </AuthProvider>
  </React.StrictMode>
);