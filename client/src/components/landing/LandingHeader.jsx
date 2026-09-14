import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Live demo", href: "#demo" },
  { label: "Why it works", href: "#why" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "rgba(251,250,249,.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--el-border)",
      }}
    >
      <div className="mx-auto flex max-w-[1300px] items-center gap-4 px-[18px] py-[14px] min-[1000px]:gap-7 min-[1000px]:px-8">
        <Link
          to="/"
          style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.035em" }}
          className="text-[20px] font-semibold"
        >
          Emly<span style={{ color: "var(--el-accent-violet)" }}>AI</span>
        </Link>

        <nav
          className="hidden flex-1 items-center gap-6 text-sm min-[1000px]:flex"
          style={{ color: "var(--el-text-secondary)" }}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex-1 min-[1000px]:hidden" />

        <Link to="/login" className="hidden text-sm min-[1000px]:inline" style={{ color: "var(--el-text-secondary)" }}>
          Sign in
        </Link>
        <Link to="/register" className="el-btn el-btn-sm el-btn-primary">
          Get started
        </Link>

        {/* Recommended addition per the handoff's responsive spec: below
            1000px the nav links + Sign in disappear entirely with nothing
            replacing them, so this hamburger sheet reproduces them. */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--el-border)] bg-[var(--el-white)] text-[var(--el-text-primary)] min-[1000px]:hidden"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden border-t border-[var(--el-border)] min-[1000px]:hidden"
          >
            <div className="flex flex-col gap-1 px-[18px] py-3 text-sm" style={{ color: "var(--el-text-secondary)" }}>
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5">
                  {link.label}
                </a>
              ))}
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5">
                Sign in
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
