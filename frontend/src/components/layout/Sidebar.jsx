import {
  LayoutDashboard,
  Receipt,
  Wallet,
  ChartNoAxesCombined,
  PiggyBank,
  Target,
  Tags,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";
import { toast } from "react-hot-toast";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: Receipt,
    },
    {
      name: "Accounts",
      path: "/accounts",
      icon: Wallet,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Budgets",
      path: "/budgets",
      icon: PiggyBank,
    },
    {
      name: "Savings Goals",
      path: "/savings-goals",
      icon: Target,
    },

    {
  name: "Categories",
  path: "/categories",
  icon: Tags,
},

  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static
          inset-y-0 left-0
          z-50
          w-72
          bg-slate-950
          text-white
          flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >

        {/* Logo */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Wallet size={21} />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                ExpenseFlow
              </h1>

              <p className="text-xs text-slate-400">
                Smart Finance
              </p>
            </div>

          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400"
          >
            <X size={22} />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex-1 p-4 space-y-1">

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  transition
                  ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                  `
                }
              >

                <Icon size={19} />

                <span className="font-medium">
                  {item.name}
                </span>

              </NavLink>
            );
          })}

          <div className="pt-6">

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
              Other
            </p>

            <NavLink
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <Settings size={19} />
              <span>Settings</span>
            </NavLink>

          </div>

        </nav>

        {/* Bottom */}

        <div className="p-4 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={19} />
            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;