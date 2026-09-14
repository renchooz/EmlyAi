import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { fadeUp } from "../lib/motion";

// Decorative only — three placeholder rows for the not-yet-built job feed.
// No real job data exists yet (see TASKS.md's job-source backlog item).
const SKELETON_ROWS = [
  { w1: "62%", w2: "38%" },
  { w1: "48%", w2: "30%" },
  { w1: "70%", w2: "44%" },
];

const LatestJobs = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Latest Jobs"
        title="A job feed built around your resumes"
        sub="Not live yet — here is what it will look like."
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl bg-brand-500 px-6 py-14 text-center text-white sm:px-10"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.14] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide">
          <Sparkles size={12} />
          COMING SOON
        </span>

        <h2
          className="mx-auto mt-5 max-w-xl font-light"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,3.6vw,44px)", lineHeight: 1.04, letterSpacing: "-0.032em" }}
        >
          Latest jobs, matched to your resumes
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base text-white/70">
          A live feed of fresh postings scored against your library — apply in one click without leaving EmlyAI.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-2">
          {SKELETON_ROWS.map((row, i) => (
            <div
              key={i}
              className="emly-shimmer relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white/[0.06] px-4 py-3.5"
              style={{ "--shimmer-delay": `${i * 400}ms` }}
            >
              <span className="h-7 w-7 shrink-0 rounded-lg bg-white/[0.14]" />
              <span className="flex flex-1 flex-col gap-1.5">
                <span className="h-1.5 rounded bg-white/20" style={{ width: row.w1 }} />
                <span className="h-1.5 rounded bg-white/[0.12]" style={{ width: row.w2 }} />
              </span>
              <span
                className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                · ·
              </span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary">Join the waitlist</Button>
          <span className="text-xs text-white/60">We'll email you the day it ships.</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LatestJobs;
