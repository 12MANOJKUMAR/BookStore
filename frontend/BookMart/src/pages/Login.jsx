import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import api from "../util/axios";
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  Loader2, 
  BookOpen,
  XCircle,
  CheckCircle,
  Shield,
  ShoppingBag
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      setTouched({ username: true, password: true });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.post("/sign-in", formData);
      const userResponse = await api.get("/get-user-information");

      dispatch(authActions.setUser(userResponse.data));
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));

      // Show success message with role info
      setLoginSuccess({
        role: response.data.role,
        username: userResponse.data.username
      });
      
      setMessage({ 
        type: "success", 
        text: `Welcome back! Redirecting to ${response.data.role === 'admin' ? 'Admin Panel' : 'your Profile'}...` 
      });

      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Invalid credentials. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyles = (fieldName) => {
    const isEmpty = touched[fieldName] && !formData[fieldName];
    return `w-full pl-11 pr-11 py-3.5 rounded-xl bg-zinc-700/50 border text-white placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-zinc-700 ${
      isEmpty 
        ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500" 
        : "border-zinc-600 focus:ring-yellow-400/30 focus:border-yellow-400"
    }`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-zinc-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-zinc-700/50">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-400/20">
              <BookOpen className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-zinc-400 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Role Badges */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-700/50 border border-zinc-600/50">
              <ShoppingBag className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-zinc-300">User</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-700/50 border border-zinc-600/50">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-zinc-300">Admin</span>
            </div>
          </div>

          {/* Success State with Role Display */}
          {loginSuccess && (
            <div className={`mb-6 p-4 rounded-xl border ${
              loginSuccess.role === 'admin' 
                ? 'bg-blue-500/10 border-blue-500/20' 
                : 'bg-green-500/10 border-green-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  loginSuccess.role === 'admin' ? 'bg-blue-500/20' : 'bg-green-500/20'
                }`}>
                  {loginSuccess.role === 'admin' 
                    ? <Shield className="w-5 h-5 text-blue-400" />
                    : <User className="w-5 h-5 text-green-400" />
                  }
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    loginSuccess.role === 'admin' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {loginSuccess.role === 'admin' ? 'Admin Access Granted' : 'Login Successful'}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Welcome, {loginSuccess.username}!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message Alert */}
          {message.text && !loginSuccess && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'error' 
                ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                : 'bg-green-500/10 border border-green-500/20 text-green-400'
            }`}>
              {message.type === 'error' 
                ? <XCircle className="w-5 h-5 flex-shrink-0" /> 
                : <CheckCircle className="w-5 h-5 flex-shrink-0" />
              }
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="relative group">
              <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                touched.username && !formData.username 
                  ? 'text-red-400' 
                  : 'text-zinc-400 group-focus-within:text-yellow-400'
              }`} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputStyles('username')}
                required
              />
              {formData.username && (
                <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
              )}
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                touched.password && !formData.password 
                  ? 'text-red-400' 
                  : 'text-zinc-400 group-focus-within:text-yellow-400'
              }`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputStyles('password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-400 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-yellow-400 focus:ring-yellow-400/30 focus:ring-offset-0"
                />
                <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  Remember me
                </span>
              </label>
              <button 
                type="button"
                className="text-yellow-400 hover:text-yellow-300 transition-colors hover:underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 font-semibold py-3.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-zinc-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <p className="text-zinc-400 text-sm text-center">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors hover:underline underline-offset-4"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/30">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-zinc-300">User Panel</span>
            </div>
            <p className="text-[10px] text-zinc-500">Browse books, manage cart & orders</p>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-zinc-300">Admin Panel</span>
            </div>
            <p className="text-[10px] text-zinc-500">Manage books, orders & users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
