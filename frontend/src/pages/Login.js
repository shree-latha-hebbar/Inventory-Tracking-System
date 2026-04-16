import { useState } from "react";

function Login() {
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

    // later we will connect this to backend
    // axios.post("http://127.0.0.1:5000/login", loginData)
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
          <div className="mb-6">
            <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-3">
              Your Role
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("manager")}
                className={`rounded-2xl border px-4 py-5 flex flex-col items-center justify-center transition-all ${
                  selectedRole === "manager"
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                <span className="text-xl mb-2">📘</span>
                <span className="font-medium">Manager</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("staff")}
                className={`rounded-2xl border px-4 py-5 flex flex-col items-center justify-center transition-all ${
                  selectedRole === "staff"
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                <span className="text-xl mb-2">🧑‍💼</span>
                <span className="font-medium">Staff</span>
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 rounded-2xl border border-gray-200 px-4 text-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 rounded-2xl border border-gray-200 px-4 text-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between mb-8 text-sm">
            <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-blue-500"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-black text-white text-lg font-medium hover:bg-gray-900 transition"
          >
            Sign in →
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;