export const DEMO_STEPS = [
  { n: "01", label: "Upload & paste", dur: 3200, crumb: "emlyai.app/library" },
  { n: "02", label: "Score resumes", dur: 3600, crumb: "emlyai.app/analysis" },
  { n: "03", label: "Write the email", dur: 5200, crumb: "emlyai.app/compose" },
  { n: "04", label: "Send from Gmail", dur: 4200, crumb: "emlyai.app/sent" },
];

const EMAIL =
  "Hi Priya — I'm applying for the Senior Frontend Engineer role at Northwind. I led the design-system rebuild at Lumen, cutting release time 40% across twelve product teams, and I've shipped React and TypeScript at scale for six years. The component-library ownership in your posting is exactly the work I want to keep doing. My resume is attached — happy to walk through it any time this week.";

const RING_CIRCUMFERENCE = 264;

/**
 * The hero's self-playing, looping 4-step product demo. Controlled by the
 * parent (`HeroSection`) so its "↻ Replay demo" button can drive the same
 * loop state this renders.
 */
export function ProductDemo({ step, t, reduced }) {
  const score = step === 0 ? 0 : step === 1 ? Math.round(86 * t) : 86;
  const typedLen =
    step < 2 ? 0 : step === 2 ? Math.round(EMAIL.length * Math.min(1, t * 1.15)) : EMAIL.length;
  const clock = "00:" + String(Math.min(40, Math.round(step * 10 + t * 10))).padStart(2, "0");
  const scanOn = step === 1 && !reduced;

  return (
    <div className="mt-14 grid grid-cols-1 items-start gap-5 min-[1000px]:grid-cols-[minmax(0,260px)_minmax(0,1fr)] min-[1000px]:gap-6">
      {/* Step rail — a wrapping horizontal row above the panel below 1000px,
          the sticky left column at/above it. */}
      <div
        className="flex flex-row flex-wrap gap-2 min-[1000px]:sticky min-[1000px]:flex-col min-[1000px]:flex-nowrap min-[1000px]:gap-1.5"
        style={{ top: 90 }}
      >
        {DEMO_STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          const pct = done ? 100 : active ? Math.round(t * 100) : 0;
          return (
            <div
              key={s.n}
              className="min-w-0 rounded-2xl px-[16px] py-[14px] [flex:1_1_150px] min-[1000px]:flex-none min-[1000px]:px-[18px] min-[1000px]:py-4"
              style={{
                background: active ? "var(--el-white)" : "transparent",
                border: `1px solid ${active ? "var(--el-black)" : "var(--el-border)"}`,
                transition: "background .3s ease, border-color .3s ease",
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  style={{
                    fontFamily: "var(--el-font-mono)",
                    fontSize: 11,
                    color: active ? "var(--el-accent-violet)" : "var(--el-text-tertiary)",
                  }}
                >
                  {s.n}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: i <= step ? "var(--el-text-primary)" : "var(--el-text-tertiary)" }}
                >
                  {s.label}
                </span>
                <span
                  className="ml-auto text-xs"
                  style={{ color: "var(--el-positive)", opacity: done ? 1 : 0, transition: "opacity .3s ease" }}
                >
                  ✓
                </span>
              </div>
              <div className="mt-2.5 h-[3px] overflow-hidden rounded-full" style={{ background: "var(--el-grey-150)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: "var(--el-black)", transition: "width .28s linear" }}
                />
              </div>
            </div>
          );
        })}
        <div className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--el-text-tertiary)" }}>
          Gmail OAuth. Resume attached. Nothing sent without your click.
        </div>
      </div>

      {/* Browser-chrome panel */}
      <div
        className="overflow-hidden rounded-[26px]"
        style={{
          background: "var(--el-white)",
          border: "1px solid var(--el-border)",
          boxShadow: "0 40px 90px -50px rgba(20,18,15,.45)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-[18px] py-3.5"
          style={{ background: "var(--el-grey-50)", borderBottom: "1px solid var(--el-border)" }}
        >
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--el-grey-300)" }} />
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--el-grey-300)" }} />
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--el-grey-300)" }} />
          <span
            className="ml-2 text-[11px]"
            style={{ fontFamily: "var(--el-font-mono)", color: "var(--el-text-tertiary)" }}
          >
            {DEMO_STEPS[step].crumb}
          </span>
          <span
            className="ml-auto text-[11px]"
            style={{ fontFamily: "var(--el-font-mono)", color: "var(--el-text-tertiary)" }}
          >
            {clock}
          </span>
        </div>

        <div className="relative min-h-[430px] p-[26px] max-[699px]:p-[18px]">
          {step === 0 && <LibraryView />}
          {step === 1 && <AnalysisView score={score} />}
          {step === 2 && <ComposeView typed={EMAIL.slice(0, typedLen)} />}
          {step === 3 && <SentView />}

          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[70px]"
            style={{
              opacity: scanOn ? 1 : 0,
              background: "linear-gradient(180deg, rgba(4,71,255,0), rgba(4,71,255,.09), rgba(4,71,255,0))",
              animation: "el-scan 2.2s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ViewHeading({ children }) {
  return (
    <div
      className="text-[22px] font-medium"
      style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.02em" }}
    >
      {children}
    </div>
  );
}

function LibraryView() {
  return (
    <div style={{ animation: "el-in .45s cubic-bezier(.2,0,0,1) both" }}>
      <ViewHeading>Your resume library</ViewHeading>
      <div className="mt-[18px] grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl p-[18px]" style={{ border: "1px solid var(--el-border)", background: "var(--el-grey-50)" }}>
          <div className="text-[13px] font-medium">frontend-senior.pdf</div>
          <div className="mt-1.5 text-[11px]" style={{ fontFamily: "var(--el-font-mono)", color: "var(--el-text-tertiary)" }}>
            2 pages · 148 KB
          </div>
          <div className="mt-3.5 flex flex-col gap-1.5">
            <div className="h-[5px] rounded-full" style={{ background: "var(--el-grey-200)" }} />
            <div className="h-[5px] w-[70%] rounded-full" style={{ background: "var(--el-grey-200)" }} />
          </div>
        </div>
        <div className="rounded-2xl p-[18px]" style={{ border: "1px solid var(--el-border)", background: "var(--el-grey-50)" }}>
          <div className="text-[13px] font-medium">fullstack-2026.pdf</div>
          <div className="mt-1.5 text-[11px]" style={{ fontFamily: "var(--el-font-mono)", color: "var(--el-text-tertiary)" }}>
            2 pages · 132 KB
          </div>
          <div className="mt-3.5 flex flex-col gap-1.5">
            <div className="h-[5px] rounded-full" style={{ background: "var(--el-grey-200)" }} />
            <div className="h-[5px] w-[58%] rounded-full" style={{ background: "var(--el-grey-200)" }} />
          </div>
        </div>
        <div
          className="flex items-center justify-center rounded-2xl p-[18px] text-[13px]"
          style={{ border: "1px dashed var(--el-border-strong)", background: "var(--el-white)", color: "var(--el-text-tertiary)" }}
        >
          + drop a resume
        </div>
      </div>
      <div className="mt-[22px] rounded-2xl p-[18px]" style={{ background: "var(--el-surface-sunken)" }}>
        <div className="text-xs uppercase" style={{ letterSpacing: "0.04em", color: "var(--el-text-tertiary)" }}>
          Pasted job description
        </div>
        <div className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--el-text-secondary)" }}>
          Senior Frontend Engineer — React, TypeScript, design systems. You'll own the component library and
          partner with design on a new marketing surface…
        </div>
      </div>
    </div>
  );
}

function AnalysisView({ score }) {
  const ringOffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * score) / 100;
  return (
    <div style={{ animation: "el-in .45s cubic-bezier(.2,0,0,1) both" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <ViewHeading>Match analysis</ViewHeading>
        <div className="text-[12px]" style={{ fontFamily: "var(--el-font-mono)", color: "var(--el-text-tertiary)" }}>
          3 resumes scored
        </div>
      </div>
      <div className="mt-[22px] grid items-center gap-6 sm:grid-cols-[minmax(0,170px)_minmax(0,1fr)]">
        <div className="relative flex items-center justify-center">
          <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--el-grey-150)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--el-accent-violet)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
              style={{ transition: "stroke-dashoffset .2s linear" }}
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-[32px] font-normal" style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.03em" }}>
              {score}
            </div>
            <div className="text-[11px]" style={{ color: "var(--el-text-tertiary)" }}>
              ATS match
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="text-xs uppercase" style={{ letterSpacing: "0.04em", color: "var(--el-text-tertiary)" }}>
              Strengths
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["React · 6 yrs", "Design systems", "TypeScript"].map((label, i) => (
                <span
                  key={label}
                  className="rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: "var(--el-positive-surface)",
                    color: "var(--el-positive)",
                    animation: `el-pop .4s ${i * 0.1}s cubic-bezier(.2,0,0,1) both`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase" style={{ letterSpacing: "0.04em", color: "var(--el-text-tertiary)" }}>
              Missing from your resume
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Accessibility audits", "Storybook"].map((label, i) => (
                <span
                  key={label}
                  className="rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: "var(--el-warning-surface)",
                    color: "var(--el-warning)",
                    animation: `el-pop .4s ${0.3 + i * 0.1}s cubic-bezier(.2,0,0,1) both`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div
            className="flex items-center gap-2.5 rounded-2xl px-4 py-3.5 text-[13px]"
            style={{ border: "1px solid var(--el-black)" }}
          >
            <span className="font-medium">frontend-senior.pdf</span>
            <span style={{ color: "var(--el-text-secondary)" }}>selected for this application</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposeView({ typed }) {
  return (
    <div style={{ animation: "el-in .45s cubic-bezier(.2,0,0,1) both" }}>
      <ViewHeading>Drafting your email</ViewHeading>
      <div className="mt-5 overflow-hidden rounded-2xl" style={{ border: "1px solid var(--el-border)" }}>
        <div
          className="flex gap-2.5 px-[18px] py-3.5 text-[13px]"
          style={{ background: "var(--el-grey-50)", borderBottom: "1px solid var(--el-border)" }}
        >
          <span style={{ color: "var(--el-text-tertiary)", width: 42 }}>To</span>
          <span>priya.recruiting@northwind.co</span>
        </div>
        <div className="flex gap-2.5 px-[18px] py-3.5 text-[13px]" style={{ borderBottom: "1px solid var(--el-border)" }}>
          <span style={{ color: "var(--el-text-tertiary)", width: 42 }}>Subject</span>
          <span className="font-medium">Senior Frontend Engineer — Priya Nair</span>
        </div>
        <div className="min-h-[190px] px-[18px] py-5 text-[13.5px] leading-[1.8]">
          {typed}
          <span
            className="inline-block"
            style={{
              width: 2,
              height: "1em",
              background: "var(--el-accent-violet)",
              verticalAlign: "-0.15em",
              animation: "el-blink 1s steps(1) infinite",
            }}
          />
        </div>
        <div
          className="flex items-center gap-2.5 px-[18px] py-3.5"
          style={{ background: "var(--el-grey-50)", borderTop: "1px solid var(--el-border)" }}
        >
          <span
            className="rounded-[10px] px-3 py-1.5 text-[11px]"
            style={{ background: "var(--el-white)", border: "1px solid var(--el-border)", fontFamily: "var(--el-font-mono)" }}
          >
            frontend-senior.pdf
          </span>
          <span className="text-[11px]" style={{ color: "var(--el-text-tertiary)" }}>
            attached automatically
          </span>
        </div>
      </div>
    </div>
  );
}

function SentView() {
  return (
    <div className="py-10 text-center" style={{ animation: "el-in .45s cubic-bezier(.2,0,0,1) both" }}>
      <div
        className="mx-auto flex h-[66px] w-[66px] items-center justify-center rounded-full text-[28px]"
        style={{ background: "var(--el-positive-surface)", color: "var(--el-positive)", animation: "el-pop .5s cubic-bezier(.2,0,0,1) both" }}
      >
        ✓
      </div>
      <div className="mt-[22px] text-[28px] font-normal" style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.025em" }}>
        Sent from your Gmail
      </div>
      <div className="mt-2.5 text-sm" style={{ color: "var(--el-text-secondary)" }}>
        Delivered in 38 seconds · logged in your application history
      </div>
      <div className="mx-auto mt-7 flex max-w-[420px] flex-col gap-2">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left"
          style={{ border: "1px solid var(--el-border)", background: "var(--el-white)", animation: "el-in .4s both" }}
        >
          <span className="h-[26px] w-[26px] rounded-lg" style={{ background: "var(--el-black)" }} />
          <span className="text-[13px] font-medium">Northwind — Senior Frontend</span>
          <span
            className="ml-auto text-[11px]"
            style={{ fontFamily: "var(--el-font-mono)", color: "var(--el-positive)" }}
          >
            sent
          </span>
        </div>
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left"
          style={{ border: "1px solid var(--el-border)", background: "var(--el-grey-50)", opacity: 0.7 }}
        >
          <span className="h-[26px] w-[26px] rounded-lg" style={{ background: "var(--el-grey-300)" }} />
          <span className="text-[13px]">Lumen — Frontend Engineer</span>
          <span
            className="ml-auto text-[11px]"
            style={{ fontFamily: "var(--el-font-mono)", color: "var(--el-text-tertiary)" }}
          >
            2 days ago
          </span>
        </div>
      </div>
    </div>
  );
}
