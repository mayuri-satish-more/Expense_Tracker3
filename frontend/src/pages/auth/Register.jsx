import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  WalletCards,
  ArrowRight,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import api from "../../services/api.js";
import { setCredentials } from "../../redux/slices/authSlice.js";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      );

      toast.success("Account created successfully!");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Left */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950" />

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">

          <div className="flex items-center gap-3 text-white">

            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center">
              <WalletCards size={24} />
            </div>

            <span className="text-2xl font-bold">
              ExpenseFlow
            </span>

          </div>

          <div>

            <p className="text-emerald-400 font-medium mb-4">
              YOUR FINANCIAL JOURNEY STARTS HERE
            </p>

            <h1 className="text-5xl font-bold text-white leading-tight max-w-xl">
              Build better money habits.
            </h1>

            <p className="text-slate-400 mt-6 text-lg max-w-lg">
              Organize your finances, set meaningful goals,
              control your spending and stay on top of your
              monthly budget.
            </p>

          </div>

          <p className="text-slate-500 text-sm">
            © 2026 ExpenseFlow
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-3 mb-8">

            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <WalletCards size={22} />
            </div>

            <span className="text-xl font-bold">
              ExpenseFlow
            </span>

          </div>

          <div className="mb-7">

            <h2 className="text-3xl font-bold text-slate-900">
              Create your account
            </h2>

            <p className="text-slate-500 mt-2">
              Start managing your finances today.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Mayuri More"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              />

            </div>

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
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <p className="text-center text-slate-500 mt-7">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;