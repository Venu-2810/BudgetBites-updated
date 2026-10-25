import { useContext } from "react";
import { FoodContext } from "../../contexts/FoodContext";
import FoodCard from "./FoodCard";
import CartSummary from "../cart/CartSummary";

const FoodGrid = () => {
  const {
    filteredFoods,
    searchTerm,
    setSearchTerm,
    budget,
    setBudget,
    category,
    setCategory,
  } = useContext(FoodContext);

  return (
    <div style={{ display: "flex", gap: "24px", padding: "16px" }}>
      {/* Cart */}
      <div style={{ width: "300px" }}>
        <CartSummary />
      </div>

      {/* Food list + filters */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginRight: "8px", padding: "6px" }}
          />
          <input
            type="number"
            placeholder="Max budget"
            value={budget}
            onChange={e => setBudget(e.target.value ? Number(e.target.value) : '')}
            style={{ marginRight: "8px", padding: "6px" }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "6px" }}>
            <option value="">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Beverages">Beverages</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px"
        }}>
          {filteredFoods.length === 0 ? <p>No foods found</p> : filteredFoods.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodGrid;
