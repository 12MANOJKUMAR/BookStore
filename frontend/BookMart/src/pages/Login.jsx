import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dummy login API (reqres.in)
      const response = await axios.post("https://reqres.in/api/login", {
        email: formData.email,
        password: formData.password
      });

      console.log(response.data);
      setMessage("Login successful! Token: " + response.data.token);
    } catch (error) {
      console.error(error);
      setMessage("Login failed: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="bg-zinc-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm -mt-20">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-zinc-700 text-white outline-none placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-zinc-700 text-white outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center text-gray-300">{message}</p>}

        {/* 👇 Register link */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
