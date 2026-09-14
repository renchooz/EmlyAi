import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

/**
 * Shared per-page header used across every authenticated app screen: a
 * small violet-dot eyebrow pill, a light-weight display-font H1, and a
 * secondary sub-line. Matches the design handoff's "Page header" (B3)
 * spec, which every screen in `EmlyAI App.dc.html` uses identically.
 */
const PageHeader = ({ eyebrow, title, sub, actions }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.4 }}
      className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3.5 py-1.5 text-xs font-medium text-fg-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-ai-500" />
          {eyebrow}
        </div>

        <h1
          className="mt-4 font-light text-fg"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 3.6vw, 46px)",
            lineHeight: 1.04,
            letterSpacing: "-0.032em",
          }}
        >
          {title}
        </h1>

        {sub && <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted">{sub}</p>}
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </motion.div>
  );
};

export default PageHeader;
