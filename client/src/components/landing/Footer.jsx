import { Link } from "react-router-dom";

const LINKS = [
  { label: "Live demo", href: "#demo" },
  { label: "Why it works", href: "#why" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Footer = () => {
  return (
    <footer className="px-[18px] pt-9 pb-14 min-[700px]:px-8">
      <div className="mx-auto flex max-w-[1300px] flex-wrap items-center gap-4 text-sm" style={{ color: "var(--el-text-secondary)" }}>
        <Link
          to="/"
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.03em", color: "var(--el-text-primary)" }}
        >
          Emly<span style={{ color: "var(--el-accent-violet)" }}>AI</span>
        </Link>
        <div className="flex-1" />
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <span className="text-xs" style={{ color: "var(--el-text-tertiary)" }}>
          © 2026 EmlyAI
        </span>
      </div>
    </footer>
  );
};

export default Footer;
