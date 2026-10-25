import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import './FoodCard.css';
import CartSummary from '../cart/CartSummary';
import { FoodContext } from '../../contexts/FoodContext';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log('Add to Cart button clicked for food:',food.name);
    addToCart(food);
  };
    

    return (
     <div className='food-card'
      style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        border:'1px solid #ddd',
        padding:'16px',
        width:'250px',
        borderRadius:'8px',
        boxSizing:'border-box',
        height:'100%',
        }}>

      
        
            <img
              src={food.image}
              alt={food.name}
              style={{
                width:'100%',
                height:'180px',
                objectFit:'cover',
                borderRadius:'4px',
              }}
              
              />
              <div className='food-info'>
                <h3 className='food-name'>{food.name}</h3>
                <p className='food-description'>{food.description}</p>
                <p className='food-price'>{food.price}</p>
                </div>

              <button style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#5a52e8ff',
                color: '#fff',
                border:'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick = {handleAddToCart} >
                Add to Cart
                </button>
        </div>
        
    );
};

export default FoodCard;