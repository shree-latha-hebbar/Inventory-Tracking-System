import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct({ products, setProducts }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    total: "",
    current: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(), // unique id
      name: form.name,
      category: form.category,
      total: Number(form.total),
      current: Number(form.current),
    };

    setProducts([...products, newProduct]);

    // go back to products page
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Add Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="total"
          placeholder="Total Quantity"
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="current"
          placeholder="Available Quantity"
          onChange={handleChange}
          className="w-full mb-6 p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;