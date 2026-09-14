import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    // No grid below 900px — the sidebar is `fixed` there (see Sidebar.jsx),
    // and a fixed item drops out of grid flow entirely, which would
    // collapse this content column back into the sidebar's own track.
    <div className="min-h-screen bg-canvas text-fg min-[900px]:grid min-[900px]:grid-cols-[268px_minmax(0,1fr)]">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="min-w-0">
        <Navbar navOpen={navOpen} onToggleNav={() => setNavOpen((o) => !o)} />

        <main className="px-[18px] pt-[22px] pb-10 min-[900px]:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
