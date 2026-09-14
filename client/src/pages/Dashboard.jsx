import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { animate, useReducedMotion } from "framer-motion";
import {
  FileText,
  Mail,
  ScanSearch,
  Target,
  Send,
  Settings,
  Sparkles,
} from "lucide-react";

import { useResume } from "../context/ResumeContext";
import { useEmailHistory } from "../context/EmailHistoryContext";
import { useAI } from "../context/AIContext";

import PageHeader from "../components/PageHeader";
import EmlyChatPanel from "../components/EmlyChatPanel";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/empty-state";

const useCountUp = (target, reduceMotion) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target || 0, {
      duration: reduceMotion ? 0 : 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    });

    return () => controls.stop();
  }, [target, reduceMotion]);

  return value;
};

const scoreColor = (score) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
};

const StatCard = ({ icon: Icon, title, value, suffix = "", reduceMotion }) => {
  const animated = useCountUp(value, reduceMotion);

  return (
    <Card className="transition-transform hover:-translate-y-1">
      <CardContent className="p-[22px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-fg-muted">{title}</p>
          <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-surface-sunken text-fg-muted">
            <Icon size={15} />
          </span>
        </div>

        <p
          className="mt-4 font-light leading-none text-fg"
          style={{ fontFamily: "var(--font-display)", fontSize: 38, letterSpacing: "-0.035em" }}
        >
          {Math.round(animated)}
          {suffix}
        </p>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { resumes } = useResume();
  const { emails } = useEmailHistory();
  const { analysisHistory } = useAI();
  const reduceMotion = useReducedMotion();

  const sentEmails = emails?.filter((email) => email.status === "sent") || [];

  const avgMatchScore = analysisHistory?.length
    ? Math.round(
        analysisHistory.reduce((sum, a) => sum + (a.matchScore || 0), 0) /
          analysisHistory.length
      )
    : 0;

  const stats = [
    { title: "Resumes uploaded", value: resumes?.length || 0, icon: FileText },
    { title: "Jobs analyzed", value: analysisHistory?.length || 0, icon: ScanSearch },
    { title: "Avg match score", value: avgMatchScore, suffix: "%", icon: Target },
    { title: "Applications sent", value: sentEmails.length, icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Good afternoon"
        title="Let's find your next opportunity."
        sub="Analyze a job description against your resumes, or upload a new one to keep your applications sharp."
        actions={
          <>
            <Link to="/analyze">
              <Button>Analyze a job</Button>
            </Link>
            <Link to="/resumes">
              <Button variant="secondary">Upload resume</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} reduceMotion={reduceMotion} />
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="font-medium text-fg"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
          >
            Ask EmlyAI
          </h2>
          <Link to="/chat" className="text-sm font-medium text-fg-muted hover:text-fg">
            Open full chat →
          </Link>
        </div>
        <EmlyChatPanel className="h-[70vh]" />
      </div>

      <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <Card>
          <CardContent className="p-[26px]">
            <div className="flex items-center gap-3">
              <div>
                <h2
                  className="font-medium text-fg"
                  style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
                >
                  Recent analyses
                </h2>
                <p className="mt-1 text-sm text-fg-muted">Your latest resume-to-job matches.</p>
              </div>

              <div className="flex-1" />

              <Link to="/analyze">
                <Button variant="secondary" size="sm">
                  New analysis
                </Button>
              </Link>
            </div>

            {analysisHistory?.length > 0 ? (
              <div className="mt-5 space-y-3">
                {analysisHistory.slice(0, 5).map((analysis) => (
                  <div
                    key={analysis._id}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-surface-sunken p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-fg">
                        {analysis.jobTitle || analysis.jobDescription?.slice(0, 60) || "Untitled role"}
                      </p>
                      <p className="mt-1 truncate text-sm text-fg-muted">
                        {analysis.companyName || "Company not specified"} ·{" "}
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className={`shrink-0 text-lg font-semibold ${scoreColor(analysis.matchScore || 0)}`}>
                      {analysis.matchScore || 0}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState
                  icon={Target}
                  title="No analyses yet"
                  description="Paste a job description against one of your resumes and your match score lands here."
                  action={
                    <Link to="/analyze">
                      <Button size="sm">Analyze your first job</Button>
                    </Link>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card>
            <CardContent className="p-[26px]">
              <h2
                className="font-medium text-fg"
                style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
              >
                Quick actions
              </h2>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/resumes"
                  className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-sunken px-3.5 py-3 text-sm font-medium text-fg transition hover:translate-x-1 hover:bg-elevated"
                >
                  <FileText size={16} className="text-fg-muted" />
                  <span className="flex-1">Manage resumes</span>
                  <span className="text-fg-subtle">→</span>
                </Link>

                <Link
                  to="/one-click-apply"
                  className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-sunken px-3.5 py-3 text-sm font-medium text-fg transition hover:translate-x-1 hover:bg-elevated"
                >
                  <Send size={16} className="text-fg-muted" />
                  <span className="flex-1">One click apply</span>
                  <span className="text-fg-subtle">→</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-sunken px-3.5 py-3 text-sm font-medium text-fg transition hover:translate-x-1 hover:bg-elevated"
                >
                  <Settings size={16} className="text-fg-muted" />
                  <span className="flex-1">Gmail settings</span>
                  <span className="text-fg-subtle">→</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="relative overflow-hidden rounded-[22px] bg-brand-500 p-[26px] text-white">
            <div className="flex items-center gap-2.5">
              <h2
                className="font-medium"
                style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
              >
                Latest jobs
              </h2>
              <span className="rounded-full bg-white/[0.14] px-2.5 py-1 text-[11px] font-semibold tracking-wide">
                <Sparkles size={10} className="mr-1 inline -translate-y-px" />
                COMING SOON
              </span>
            </div>

            <p className="mt-2.5 max-w-[340px] text-sm leading-relaxed text-white/70">
              Fresh roles matched to your resumes will appear right here — apply without leaving the dashboard.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {[
                { w1: "62%", w2: "38%" },
                { w1: "48%", w2: "30%" },
                { w1: "70%", w2: "44%" },
              ].map((row, i) => (
                <div
                  key={i}
                  className="emly-shimmer relative flex items-center gap-3 overflow-hidden rounded-[14px] bg-white/[0.06] px-3.5 py-3"
                  style={{ "--shimmer-delay": `${i * 400}ms` }}
                >
                  <span className="h-[26px] w-[26px] shrink-0 rounded-lg bg-white/[0.14]" />
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className="h-[7px] rounded bg-white/20" style={{ width: row.w1 }} />
                    <span className="h-1.5 rounded bg-white/[0.12]" style={{ width: row.w2 }} />
                  </span>
                  <span
                    className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/60"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    · ·
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link to="/latest-jobs">
                <Button variant="secondary" size="sm">
                  Join the waitlist
                </Button>
              </Link>
              <span className="text-xs text-white/60">We'll email you when it ships.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
