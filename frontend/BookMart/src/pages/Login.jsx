import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import api from "../util/axios"; // ✅ axios instance

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ login request using axios instance
      const response = await api.post("/sign-in", formData);

      // ✅ fetch user data using axios instance (no hardcoded URL now)
      const userResponse = await api.get("/get-user-information");

      // update redux state with user data
      dispatch(authActions.setUser(userResponse.data));
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));

      navigate("/profile");
    } catch (error) {
      console.error(error);
      setMessage(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="bg-zinc-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm -mt-20">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-zinc-700 text-white outline-none placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-zinc-700 text-white outline-none placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center text-gray-300">{message}</p>}

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
