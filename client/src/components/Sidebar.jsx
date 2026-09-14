import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { navLinks } from "../config/navLinks";
import { useGmail } from "../context/GmailContext";

/**
 * Single sidebar for every breakpoint (per the design handoff's responsive
 * spec — one `<aside>`, CSS-driven, no separate mobile component): at
 * `min-[900px]` it's a normal sticky in-flow column; below that it's a
 * fixed left drawer sliding on `translate-x`, with a scrim, toggled by the
 * hamburger button in `Navbar`. `open`/`onClose` only matter below 900px —
 * the `min-[900px]:` overrides below force it open/in-flow regardless.
 */
const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { gmailConnected, gmailEmail, connectGmail, gmailLoading } = useGmail();

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-[rgba(20,18,15,.34)] transition-opacity duration-300 min-[900px]:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[272px] flex-col gap-6 overflow-y-auto border-r border-border bg-elevated px-[18px] py-6 transition-transform duration-[340ms] ease-[cubic-bezier(.2,0,0,1)] ${
          open ? "translate-x-0 shadow-[0_30px_70px_-30px_rgba(20,18,15,.5)]" : "-translate-x-full"
        } min-[900px]:sticky min-[900px]:top-0 min-[900px]:z-40 min-[900px]:h-screen min-[900px]:w-[268px] min-[900px]:translate-x-0 min-[900px]:shadow-none`}
      >
        <div className="px-2">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-brand-500 font-semibold text-white"
              style={{ fontFamily: "var(--font-display)", fontSize: 14 }}
            >
              E
            </span>
            <span
              className="font-semibold text-fg"
              style={{ fontFamily: "var(--font-display)", fontSize: 19, letterSpacing: "-0.03em" }}
            >
              EmlyAI
            </span>
          </div>
          <p className="mt-2 text-xs text-fg-subtle">Smarter resumes. Better opportunities.</p>
        </div>

        <nav className="relative flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={onClose}
                className="group relative flex h-[42px] items-center gap-3 rounded-[14px] px-3.5 text-sm font-medium transition-colors"
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        className="absolute inset-0 rounded-[14px] bg-brand-500"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}

                    <span
                      className={`relative z-10 flex w-full items-center gap-3 ${
                        isActive ? "text-white" : "text-fg-muted group-hover:text-fg"
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.75} />
                      <span className="flex-1">{item.name}</span>
                      {item.soon && (
                        <span className="rounded-full bg-surface-sunken px-2 py-0.5 text-[10px] font-semibold tracking-wide text-fg-muted">
                          SOON
                        </span>
                      )}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="rounded-2xl bg-surface-sunken p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-fg">
            <span className={`h-[7px] w-[7px] rounded-full ${gmailConnected ? "bg-success" : "bg-warning"}`} />
            {gmailConnected ? "Gmail connected" : "Gmail not connected"}
          </div>
          <p className="mt-2 mb-3.5 text-xs leading-relaxed text-fg-muted">
            {gmailConnected
              ? `Applications send from ${gmailEmail}.`
              : "Connect Gmail to send applications from your own address."}
          </p>
          <button
            type="button"
            onClick={() => {
              onClose?.();
              if (gmailConnected) navigate("/settings");
              else connectGmail();
            }}
            disabled={gmailLoading}
            className="h-[34px] w-full rounded-full bg-brand-500 text-[13px] font-medium text-white transition hover:bg-brand-400 disabled:opacity-60"
          >
            {gmailConnected ? "Manage connection" : "Connect Gmail"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
