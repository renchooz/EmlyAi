import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Building2,
  Briefcase,
} from "lucide-react";

import { useResume } from "../context/ResumeContext";
import { useAI } from "../context/AIContext";

import PageHeader from "../components/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ScoreRing } from "../components/ui/score-ring";
import { fadeUp, staggerContainer } from "../lib/motion";

const STATUS_STEPS = [
  "Reading your resume…",
  "Understanding the role…",
  "Comparing skills & keywords…",
  "Calculating your match…",
];

const scoreBand = (score) => {
  if (score >= 80) return { label: "Excellent match", color: "text-success" };
  if (score >= 60) return { label: "Good match", color: "text-warning" };
  return { label: "Needs work", color: "text-danger" };
};

// Real request in flight; this copy is only cosmetic pacing over that one
// call, never fabricated intermediate results.
const useStagedStatus = (active) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      clearInterval(timerRef.current);
      return;
    }

    // Deferred via setTimeout (an external-callback boundary) rather than
    // called directly here, so the reset itself never runs synchronously
    // inside the effect body.
    const resetTimer = setTimeout(() => setIndex(0), 0);

    timerRef.current = setInterval(() => {
      setIndex((prev) => Math.min(prev + 1, STATUS_STEPS.length - 1));
    }, 1100);

    return () => {
      clearTimeout(resetTimer);
      clearInterval(timerRef.current);
    };
  }, [active]);

  return STATUS_STEPS[index];
};

const SubScoreBar = ({ label, value = 0 }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between text-xs">
      <span className="text-fg-muted">{label}</span>
      <span className="font-medium text-fg">{value}%</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
      <motion.div
        className="h-full rounded-full bg-ai-500"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  </div>
);

const SkillChips = ({ items = [], variant }) => {
  if (!items.length) {
    return <p className="text-sm text-fg-subtle">Nothing found.</p>;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.05)} className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={fadeUp}
          className={
            variant === "matched"
              ? "rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success"
              : "rounded-full bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning"
          }
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Analyze = () => {
  const { resumes } = useResume();
  const { analyzeResume, analysisResult, aiLoading } = useAI();

  const [resumeId, setResumeId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const statusCopy = useStagedStatus(aiLoading);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    await analyzeResume({ resumeId, jobDescription, companyName, jobTitle });
  };

  const score = analysisResult?.matchScore || 0;
  const band = scoreBand(score);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI resume analysis"
        title="Analyze resume against JD"
        sub="Pick a resume, paste the job description, and get a match score, strengths, gaps and concrete fixes."
      />

      <div className="grid gap-3.5 lg:grid-cols-2">
        <Card>
          <CardContent className="p-[26px]">
            <h2
              className="font-medium text-fg"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
            >
              Job details
            </h2>

            <form onSubmit={handleAnalyze} className="mt-5 space-y-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
                  Step 1 · resume
                </label>

                <select
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg outline-none focus:border-brand-500"
                >
                  <option value="">Choose a resume</option>

                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.originalName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 border-t border-border pt-5">
                <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
                  Step 2 · job description
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company (optional)"
                      className="pl-9"
                    />
                  </div>

                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
                    <Input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Job title (optional)"
                      className="pl-9"
                    />
                  </div>
                </div>

                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                  placeholder="Paste job description here..."
                />
              </div>

              <Button type="submit" loading={aiLoading} className="w-full">
                {!aiLoading && <Sparkles size={18} />}
                {aiLoading ? statusCopy : "Analyze with AI"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="emly-ai-border lg:sticky lg:top-24" style={{ background: "var(--color-surface-sunken)" }}>
          <CardContent className="p-[26px]">
            <AnimatePresence mode="wait">
              {aiLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[480px] flex-col items-center justify-center text-center"
                >
                  <span className="mb-5 inline-block h-[13px] w-[13px] animate-spin rounded-full border-2 border-border" style={{ borderTopColor: "var(--color-ai-500)" }} />

                  <h2 className="text-lg font-semibold text-fg">{statusCopy}</h2>

                  <p className="mt-2 max-w-md text-sm text-fg-muted">EmlyAI is comparing your resume against this role.</p>
                </motion.div>
              ) : !analysisResult ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[480px] flex-col items-center justify-center text-center"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated text-fg-muted">
                    <Brain size={32} />
                  </div>

                  <h2 className="text-xl font-semibold text-fg">Waiting for analysis</h2>

                  <p className="mt-2 max-w-md text-sm text-fg-muted">
                    Your match score, strengths, missing skills and suggestions will appear here after analysis.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-elevated p-5 sm:flex-row sm:justify-between">
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-fg-muted">Overall match</p>
                      <p className={`mt-1 text-lg font-semibold ${band.color}`}>{band.label}</p>
                    </div>

                    <ScoreRing score={score} size={120} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-border bg-elevated p-5">
                    <SubScoreBar label="ATS compatibility" value={analysisResult.atsScore ?? 0} />
                    <SubScoreBar label="Skill match" value={analysisResult.skillMatchScore ?? 0} />
                    <SubScoreBar label="Experience match" value={analysisResult.experienceMatchScore ?? 0} />
                    <SubScoreBar label="Keyword match" value={analysisResult.keywordMatchScore ?? 0} />
                  </div>

                  <div className="custom-scroll max-h-[420px] space-y-5 overflow-y-auto pr-2">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-fg">
                        <CheckCircle2 size={18} className="text-success" />
                        Strengths
                      </h3>
                      <SkillChips items={analysisResult.strengths} variant="matched" />
                    </div>

                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-fg">
                        <AlertCircle size={18} className="text-warning" />
                        Missing skills
                      </h3>
                      <SkillChips items={analysisResult.missingSkills} variant="missing" />
                    </div>

                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-fg">
                        <Lightbulb size={18} className="text-warning" />
                        AI insights
                      </h3>

                      {analysisResult.suggestions?.length > 0 ? (
                        <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.08)} className="space-y-2">
                          {analysisResult.suggestions.map((item, index) => (
                            <motion.div
                              key={index}
                              variants={fadeUp}
                              className="flex gap-3 rounded-xl border border-border bg-elevated p-3.5 text-sm leading-6 text-fg-muted"
                            >
                              <span className="pt-0.5 text-xs text-fg-subtle" style={{ fontFamily: "var(--font-mono)" }}>
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              {item}
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <p className="text-sm text-fg-subtle">Nothing found.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analyze;
