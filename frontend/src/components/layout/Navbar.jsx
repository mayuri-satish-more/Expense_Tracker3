import {
  Menu,
  Bell,
  Plus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setIsOpen }) => {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">

      <div className="flex items-center gap-4">

        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm text-slate-500 hidden sm:block">
            Welcome back,
          </p>

          <h2 className="font-semibold text-slate-900">
            {user?.name || "User"} 👋
          </h2>
        </div>

      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/transactions/add")}
          className="hidden sm:flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
        >
          <Plus size={17} />
          Add Transaction
        </button>

        <button className="relative p-2.5 rounded-xl hover:bg-slate-100">
          <Bell size={20} className="text-slate-600" />

          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          {firstLetter}
        </div>

      </div>

    </header>
  );
};

export default Navbar;