import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";

function App() {
  const [products, setProducts] = useState([
    { id: 101, name: "Mouse", category: "Electronics", total: 50, current: 20 },
    { id: 102, name: "Keyboard", category: "Electronics", total: 40, current: 10 },
  ]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/products"
        element={<Products products={products} />}
      />

      <Route
        path="/add-product"
        element={
          <AddProduct
            setProducts={setProducts}
            products={products}
          />
        }
      />
    </Routes>
  );
}

export default App;