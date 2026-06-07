import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Send,
  History,
  Settings,
  Sparkles,
  PenLine,
  X,
  LogOut,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Resumes",
    path: "/resumes",
    icon: FileText,
  },
  {
    name: "Analyze JD",
    path: "/analyze",
    icon: ScanSearch,
  },
  {
    name: "Cover Letter",
    path: "/cover-letter",
    icon: PenLine,
  },
  {
    name: "One Click Apply",
    path: "/one-click-apply",
    icon: Send,
  },
  {
    name: "Email History",
    path: "/email-history",
    icon: History,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const MobileSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col border-l border-white/10 bg-slate-950 p-5 shadow-2xl lg:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-white">ApplyPilot AI</h2>
                  <p className="text-xs text-slate-500">
                    Smart applications
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <User size={16} />
                Signed in as
              </div>
              <p className="font-medium text-white">{user?.name || "User"}</p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <nav className="custom-scroll flex-1 space-y-2 overflow-y-auto pr-1">
              {links.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-violet-600 text-white"
                          : "text-slate-400 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-5 border-t border-white/10 pt-5">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full justify-center"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;