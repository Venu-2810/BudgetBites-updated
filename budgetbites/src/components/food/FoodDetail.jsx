import React from "react";

const FoodDetail = ({ food}) => {
    return (
        <div className="food-detail">
            <h2>{food.name}</h2>
            <p>{food.description}</p>
            <p>Price: {food.price}</p>
        </div>
    );
};

export default FoodDetail;