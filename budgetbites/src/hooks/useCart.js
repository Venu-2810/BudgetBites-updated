import { useState, useEffect } from "react"; 

const useCart = () => {
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ?
            JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Failed to load cart from local storage", error);
            return [];
        }
    });
            useEffect(() => {
                try {
                    localStorage.setItem('cart',JSON.stringify(cart));
                } catch (error) {
                    console.error("Failed to save cart from local storage", error);
                }
            }, [cart]);

            const addToCart = (food) => {
                setCart((prevCart) => {
                    const existingItem = prevCart.find((item) => item.id === food.id

                    );
                    if (existingItem) {
                        return prevCart.map((item) => 
                            item.id === food.id ?
                        { ...item, quantity: item.quantity + 1} : item
                        );
                    } else {
                        return[...prevCart, { ...food, quantity: 1}];
                    }
                });
            };

            const removeFromCart = (foodId) => 
            {
                setCart((prevCart) =>
                    prevCart.filter((item) => item.id !== foodId)
                );
            };

            const clearCart = () => {
                setCart([]);
            };

            return{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
            };

};
export default useCart;