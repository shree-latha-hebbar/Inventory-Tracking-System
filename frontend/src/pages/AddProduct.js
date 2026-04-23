import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    product_id: "",
    name: "",
    category: "",
    price: "",
    total: "",
    current: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        ...form,
        total: Number(form.total),
        current: Number(form.current),
      };

      await axios.post("http://127.0.0.1:5000/api/products/", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // go back to products page
      navigate("/products");
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(err.response?.data?.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Add Product</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          name="product_id"
          placeholder="Product ID (e.g. PRD-001)"
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

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
          type="text"
          name="price"
          placeholder="Price (e.g. $1,200)"
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
          disabled={loading}
          className={`w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;