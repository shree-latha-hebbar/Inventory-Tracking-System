import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";

function App() {
  const [products, setProducts] = useState([
    { id: 101, name: "Wireless Mouse", category: "Peripherals", total: 50, current: 23 },
    { id: 102, name: "Mechanical Keyboard", category: "Peripherals", total: 40, current: 4 },
    { id: 103, name: "USB-C Hub", category: "Accessories", total: 30, current: 6 },
    { id: 104, name: "HDMI Cable", category: "Cables", total: 100, current: 67 },
    { id: 105, name: "Laptop Stand", category: "Furniture", total: 35, current: 3 }
  ]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* IMPORTANT */}
      <Route path="/products" element={<Products products={products} />} />

      <Route
        path="/add-product"
        element={<AddProduct products={products} setProducts={setProducts} />}
      />
    </Routes>
  );
}

export default App;