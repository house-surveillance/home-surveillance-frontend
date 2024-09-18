// components/Layout.tsx
import { useState } from "react";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import NotificationAlert from "../components/NotificationAlert";

const Layout = () => {
  const [sideMenuIsExpand, setSideMenuIsExpand] = useState(true);

  return (
    <div className="relative min-h-screen md:flex">
      <header>
        {/* Sidebar */}
        <Sidebar setExpand={setSideMenuIsExpand} />
        {/* Main content */}
      </header>
      <div
        className={`flex-1 min-h-screen mx-0 bg-slate-100 transition-all duration-300 ease-in-out ${
          sideMenuIsExpand ? "md:ml-72" : "md:ml-20"
        }`}
      >
        <NotificationAlert />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
