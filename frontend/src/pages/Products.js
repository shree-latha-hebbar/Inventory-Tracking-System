import React from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();

  const products = [
    { id: 101, name: "Wireless Mouse", category: "Peripherals", total: 50, current: 23 },
    { id: 102, name: "Keyboard", category: "Peripherals", total: 40, current: 3 },
    { id: 103, name: "USB Hub", category: "Accessories", total: 30, current: 4 },
    { id: 104, name: "HDMI Cable", category: "Cables", total: 100, current: 67 },
    { id: 105, name: "Monitor Stand", category: "Furniture", total: 20, current: 5 },
    { id: 106, name: "Laptop Stand", category: "Furniture", total: 35, current: 18 },
    { id: 107, name: "Webcam", category: "Electronics", total: 25, current: 12 },
  ];

  const lowStockCount = products.filter((item) => item.current <= 5).length;
  const inStockCount = products.filter((item) => item.current > 5).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">
              Manage product inventory and monitor stock availability
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-200 text-black px-5 py-3 rounded-xl hover:bg-gray-300 transition"
            >
              Back
            </button>

            <button className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition">
              + Add Product
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black"
          />

          <select className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black">
            <option>All Categories</option>
            <option>Peripherals</option>
            <option>Accessories</option>
            <option>Cables</option>
            <option>Furniture</option>
            <option>Electronics</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Products</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{products.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Low Stock</p>
            <h2 className="text-3xl font-bold text-red-500 mt-2">{lowStockCount}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">In Stock</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">{inStockCount}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Product Inventory</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Total Qty</th>
                  <th className="px-6 py-4">Available</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => {
                  const low = item.current <= 5;

                  return (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-700">{item.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.category}</td>
                      <td className="px-6 py-4 text-gray-700">{item.total}</td>
                      <td className={`px-6 py-4 font-medium ${low ? "text-red-500" : "text-gray-800"}`}>
                        {item.current}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-sm rounded-full font-medium ${
                            low
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {low ? "Low Stock" : "Available"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Products;