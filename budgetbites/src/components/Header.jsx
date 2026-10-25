import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200">
      <h1 className="font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
        BudgetBites 🍔
      </h1>
      <nav className="space-x-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </nav>
    </header>
  );
}
