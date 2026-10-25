import React, { useContext } from "react";
import { FoodContext } from "../../contexts/FoodContext";
import './SearchBar.css'

const SearchBar = () => {
  const { searchTerm, setSearchTerm, budget, setBudget, category, setCategory } = useContext(FoodContext);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <form 
  onSubmit={(e) => e.preventDefault()} 
  className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 rounded-xl shadow-sm mb-6"
>
  <input
    type="text"
    value={searchTerm}
    onChange={handleSearchChange}
    placeholder="Search Foods"
    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />

  <input
    type="number"
    value={budget}
    onChange={handleBudgetChange}
    placeholder="Enter budget"
    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />

  <select
    value={category}
    onChange={handleCategoryChange}
    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select Category</option>
    <option value="Breakfast">Breakfast</option>
    <option value="Lunch">Lunch</option>
    <option value="Dinner">Dinner</option>
    <option value="Snacks">Snacks</option>
    <option value="Beverages">Beverages</option>
    <option value="Desserts">Desserts</option>
  </select>
</form>

  );
};

export default SearchBar;
