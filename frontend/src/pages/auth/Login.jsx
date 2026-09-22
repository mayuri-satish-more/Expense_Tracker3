import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, WalletCards, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import api from "../../services/api.js";
import { setCredentials } from "../../redux/slices/authSlice.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      );

      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Left Section */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">

          <div className="flex items-center gap-3 text-white">

            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center">
              <WalletCards size={24} />
            </div>

            <span className="text-2xl font-bold">
              ExpenseFlow
            </span>

          </div>

          <div className="max-w-lg">

            <p className="text-emerald-400 font-medium mb-4">
              SMART MONEY MANAGEMENT
            </p>

            <h1 className="text-5xl font-bold text-white leading-tight">
              Take control of your money.
            </h1>

            <p className="text-slate-400 mt-6 text-lg leading-relaxed">
              Track expenses, manage budgets, monitor your
              accounts and understand your spending with
              powerful analytics.
            </p>

          </div>

          <p className="text-slate-500 text-sm">
            © 2026 ExpenseFlow. Manage smarter. Spend better.
          </p>

        </div>
      </div>

      {/* Right Section */}

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-3 mb-10">

            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <WalletCards size={22} />
            </div>

            <span className="text-xl font-bold text-slate-900">
              ExpenseFlow
            </span>

          </div>

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back 👋
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to continue to your dashboard.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              />

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

          <p className="text-center text-slate-500 mt-8">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;