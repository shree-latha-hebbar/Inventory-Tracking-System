import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("manager");
  const [email, setEmail] = useState("manager@inventrack.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      role: selectedRole,
      email,
      password,
      rememberMe,
    };

    console.log("Login Data:", loginData);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
        
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-semibold text-sm">
            IT
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            InvenTrack
          </h1>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 text-base">
            Sign in to manage your inventory
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-3">
              Your Role
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("manager")}
                className={`rounded-2xl border px-4 py-5 flex flex-col items-center ${
                  selectedRole === "manager"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                📘 Manager
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("staff")}
                className={`rounded-2xl border px-4 py-5 flex flex-col items-center ${
                  selectedRole === "staff"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                🧑‍💼 Staff
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="text-xs text-gray-400 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 border rounded-xl px-3 mt-2"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="text-xs text-gray-400 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 border rounded-xl px-3 mt-2"
            />
          </div>

          {/* Remember me */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>

            <span className="text-blue-500 cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-black text-white rounded-xl"
          >
            Sign in →
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;