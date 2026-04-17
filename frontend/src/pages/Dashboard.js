import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        
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