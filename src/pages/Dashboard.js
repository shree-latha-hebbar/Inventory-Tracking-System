import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header with button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          View Products →
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl mt-2">120</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Low Stock</h2>
          <p className="text-2xl mt-2 text-red-500">5 items</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Suppliers</h2>
          <p className="text-2xl mt-2">20</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;