import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ navOpen, onToggleNav }) => {
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const initial = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3.5 border-b border-border bg-canvas/80 px-[18px] py-[14px] backdrop-blur-md min-[900px]:gap-4 min-[900px]:px-[34px] min-[900px]:py-[18px]">
      <button
        onClick={onToggleNav}
        aria-label="Menu"
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-border bg-elevated text-fg transition hover:bg-black/[0.04] min-[900px]:hidden"
      >
        {navOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div>
        <p className="text-xs text-fg-subtle">Welcome back,</p>
        <h2
          className="font-medium text-fg"
          style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "-0.02em" }}
        >
          {firstName}
        </h2>
      </div>

      <div className="flex-1" />

      <button
        onClick={logout}
        className="flex h-[34px] shrink-0 items-center rounded-full border border-border px-3.5 text-[13px] text-fg-muted transition hover:bg-black/[0.04]"
      >
        Log out
      </button>

      {/* Bare avatar on mobile (no room for the email chip); full chip from 900px up. */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-[11px] font-semibold text-fg min-[900px]:hidden">
        {initial}
      </span>

      <div className="hidden items-center gap-2 rounded-full border border-border bg-elevated py-1 pl-1.5 pr-3.5 min-[900px]:flex">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-sunken text-[11px] font-semibold text-fg">
          {initial}
        </span>
        <span className="text-[13px] text-fg">{user?.email}</span>
      </div>
    </header>
  );
};

export default Navbar;
