import { useCart } from "../../contexts/CartContext"
import './CartIcon.css'

const CartIcon = ({ onToggleCart }) => {
    const { getTotalItems } = useCart()
    const totalItems = getTotalItems()

    return (
        <button className="cart-icon" onClick={onToggleCart}>
            ?
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
    )
}

export default CartIcon