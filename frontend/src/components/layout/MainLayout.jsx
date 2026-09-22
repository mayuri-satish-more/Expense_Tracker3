import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex-1 min-w-0">

        <Navbar setIsOpen={setIsOpen} />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;