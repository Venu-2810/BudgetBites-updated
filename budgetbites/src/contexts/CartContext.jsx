import { act, createContext, useContext, useReducer } from "react"

const CartContext = createContext();

const initialState = { items: [] };

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if (existingItem) {
                return{
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                        ? {...item, quantity: item.quantity + 1 }
                        : item
                    )
                }
            }
            return {
                ...state,
                items: [...state.items, {...action.payload, quantity: 1}]
            }
            case 'REMOVE_ITEM':
                return {
                    ...state,
                    items: state.items.filter(item => item.id !== action.payload)
                }
                case 'UPDATE_QUANTITY':
                    return {
                        ...state,
                        items: state.items.map(item =>
                            item.id === action.payload.id
                            ? { ...item, quantity: action.payload.quantity }
                            : item
                        )
                    }
                    case 'CLEAR_CART':
                        return {
                            ...state,
                            items: []
                        }
                    default:
                        throw new Error(`Unknown action type: ${action.type}`);
    }
};


export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (food) => {
        dispatch({ type: 'ADD_ITEM', payload: food });
    };

    const removeFromCart = (foodId) => {
        dispatch({ type:'REMOVE_ITEM', payload: foodId });
    };

    const updateQuantity = (foodId, quantity) => {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            removeFromCart(foodId);
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: foodId, quantity } });
        }
    };

    const getTotalPrice = () => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    const getTotalItems = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    }

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{
            items: state.items,
            addToCart,
            removeFromCart,
            updateQuantity,
            getTotalPrice,
            getTotalItems,
            clearCart
        }}>
            {children}
            </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context;
};