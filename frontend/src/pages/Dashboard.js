import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").trim().toLowerCase();
  const isManager = role === "manager";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* 🔷 Header */}
        <div className="flex items-center justify-between mb-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-black text-white flex items-center justify-center rounded-2xl font-bold text-lg">
              IT
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">InvenTrack</h1>
              <p className="text-sm text-gray-500">Inventory System</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <span className="bg-white px-4 py-2 rounded-xl border text-sm text-gray-600">
              👤 {isManager ? "Manager" : "Staff"}
            </span>

            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition"
            >
              View Products →
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("role");
                navigate("/");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 🔷 Welcome Card */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-3xl mb-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome back 👋
          </h2>
          <p className="text-gray-300">
            Manage your inventory, track stock levels and monitor product performance easily.
          </p>
        </div>

        {/* 🔷 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Products</p>
            <h2 className="text-4xl font-bold mt-2">7</h2>
            <p className="text-xs text-gray-400 mt-1">Available in system</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Low Stock</p>
            <h2 className="text-4xl font-bold text-red-500 mt-2">3</h2>
            <p className="text-xs text-gray-400 mt-1">Needs attention</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Suppliers</p>
            <h2 className="text-4xl font-bold mt-2">5</h2>
            <p className="text-xs text-gray-400 mt-1">Active partners</p>
          </div>

        </div>

        {/* 🔷 Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>HDMI Cable updated</span>
                <span className="text-gray-400">Today</span>
              </div>

              <div className="flex justify-between">
                <span>Laptop Stand low stock</span>
                <span className="text-red-500">Alert</span>
              </div>

              <div className="flex justify-between">
                <span>New product added</span>
                <span className="text-green-600">Success</span>
              </div>
            </div>
          </div>

          {/* Stock Insights */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Stock Insights</h3>

            <div className="space-y-4">
              <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="font-medium">Highest Stock</p>
                  <p className="text-sm text-gray-500">HDMI Cable</p>
                </div>
                <span className="font-bold text-lg">67</span>
              </div>

              <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="font-medium">Lowest Stock</p>
                  <p className="text-sm text-gray-500">Laptop Stand</p>
                </div>
                <span className="font-bold text-red-500 text-lg">3</span>
              </div>

              <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="font-medium">Stock Status</p>
                  <p className="text-sm text-gray-500">Overall health</p>
                </div>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  Stable
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;