import React, { useContext, useEffect, useState } from "react";
import { FoodContext } from "../contexts/FoodContext";

const CreatorDashboard = () => {
  const { foods, deleteFood, updateFood } = useContext(FoodContext);
  const [myFoods, setMyFoods] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Filter only creator’s foods
  useEffect(() => {
    if (!user?._id) return;
    const creatorFoods = foods.filter(f => f.creator?._id === user._id || f.creator === user._id);
    setMyFoods(creatorFoods);
  }, [foods, user]);

  const handleEdit = async (food) => {
    const newName = prompt("Enter new name", food.name);
    const newPrice = prompt("Enter new price", food.price);
    if (!newName || !newPrice) return;
    await updateFood(food._id, { ...food, name: newName, price: Number(newPrice) });
  };

  return (
    <div>
      <h2>My Foods</h2>
      {myFoods.length === 0 ? <p>No foods added yet.</p> :
        <ul>
          {myFoods.map(f => (
            <li key={f._id}>
              {f.name} - Rs.{f.price}
              <button onClick={() => handleEdit(f)}>Edit</button>
              <button onClick={() => deleteFood(f._id)}>Delete</button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default CreatorDashboard;
