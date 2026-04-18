import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Products({ products = [] }) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const lowStockCount = filteredProducts.filter((item) => item.current <= 5).length;
  const inStockCount = filteredProducts.filter((item) => item.current > 5).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">
              Manage product inventory and monitor stock availability
            </p>
          </div>

          <button
            onClick={() => navigate("/add-product")}
            className="mt-4 md:mt-0 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition"
          >
            + Add Product
          </button>
        </div>

        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black"
          >
            <option>All Categories</option>
            <option>Peripherals</option>
            <option>Accessories</option>
            <option>Cables</option>
            <option>Furniture</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Products</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {filteredProducts.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Low Stock</p>
            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {lowStockCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">In Stock</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {inStockCount}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Product Inventory
            </h3>
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No matching products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => {
                    const low = item.current <= 5;

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-700">{item.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {item.total}
                        </td>
                        <td
                          className={`px-6 py-4 font-medium ${
                            low ? "text-red-500" : "text-gray-800"
                          }`}
                        >
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;