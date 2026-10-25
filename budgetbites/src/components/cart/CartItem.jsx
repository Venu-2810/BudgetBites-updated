import React from "react";
import { useCart } from "../../contexts/CartContext";

const CartItem = ({ item }) => {
    const { removeFromCart,
        uodateQuantity } = useCart();
    return (
        <div className="cart-item">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
            <span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </span>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>

        </div>
    );
};

export default CartItem;