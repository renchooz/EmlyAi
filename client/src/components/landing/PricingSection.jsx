import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { cn } from "../../lib/utils";

const PLANS = [
  {
    name: "Starter",
    blurb: "For a focused search — a handful of applications a week.",
    listPrice: "$9",
    unit: "/ mo",
    features: ["3 resumes", "30 applications / month", "ATS match score", "Gmail OAuth sending"],
    cta: "Get started",
    tone: "light",
  },
  {
    name: "Pro",
    tag: "Most popular",
    blurb: "For an active search — apply every day without the writing.",
    listPrice: "$19",
    unit: "/ mo",
    features: [
      "Unlimited resumes",
      "Unlimited applications",
      "Gap report & rewrite suggestions",
      "Cover letter generation",
      "Full application history",
    ],
    cta: "Start applying free",
    tone: "dark",
  },
  {
    name: "Team",
    blurb: "For career coaches and placement teams running many searches.",
    listPrice: "$39",
    unit: "/ seat",
    features: ["Everything in Pro", "Shared resume library", "Per-seat sending accounts", "Placement reporting"],
    cta: "Talk to us",
    tone: "sunken",
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-[18px] pt-[64px] pb-[72px] min-[700px]:px-8 min-[700px]:pt-24 min-[700px]:pb-[104px]"
      style={{ background: "var(--el-white)", borderTop: "1px solid var(--el-border)" }}
    >
      <img
        src="/landing/orb-meadow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute hidden sm:block"
        style={{ right: -180, top: -160, width: 440, opacity: 0.26, filter: "blur(10px)", animation: "el-orb 32s ease-in-out infinite" }}
      />
      <div className="relative mx-auto max-w-[1300px]">
        <div className="mx-auto max-w-[620px] text-center">
          <Reveal className="text-[13px] uppercase" style={{ letterSpacing: "0.05em", color: "var(--el-text-tertiary)" }}>
            Pricing
          </Reveal>
          <Reveal
            as="h2"
            delay={90}
            className="mt-3.5 font-light"
            style={{ fontFamily: "var(--el-font-display)", fontSize: "clamp(32px,4.2vw,54px)", lineHeight: 1.03, letterSpacing: "-0.032em" }}
          >
            Three plans. All free for now.
          </Reveal>
          <Reveal as="p" delay={180} className="mt-4 text-base" style={{ color: "var(--el-text-secondary)" }}>
            Pick the plan you'll grow into — we're not charging for any of them yet.
          </Reveal>
        </div>

        <div className="mt-11 grid items-stretch gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <Reveal className="mt-6 text-center text-xs" style={{ color: "var(--el-text-tertiary)" }}>
          Every plan is free while EmlyAI is in early access. No card, no send limits, cancel any time.
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({ plan }) {
  const dark = plan.tone === "dark";
  const check = dark ? "#7ee2a8" : "var(--el-positive)";

  const card = (
    <div
      className={cn("flex h-full flex-col rounded-[26px] p-[30px]", dark ? "pricing-card-hover-dark" : "pricing-card-hover")}
      style={{
        background: dark ? "var(--el-black)" : plan.tone === "sunken" ? "var(--el-surface-sunken)" : "var(--el-grey-50)",
        color: dark ? "var(--el-text-on-dark)" : "var(--el-text-primary)",
        border: plan.tone === "light" ? "1px solid var(--el-border)" : undefined,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="text-[20px] font-medium" style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.012em" }}>
          {plan.name}
        </div>
        {plan.tag ? (
          <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: "rgba(255,255,255,.12)" }}>
            {plan.tag}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm" style={{ lineHeight: 1.6, color: dark ? "var(--el-text-on-dark-muted)" : "var(--el-text-secondary)" }}>
        {plan.blurb}
      </p>
      <div className="mt-6 flex items-baseline gap-2.5">
        <span
          className="text-[26px] font-light"
          style={{
            fontFamily: "var(--el-font-display)",
            color: dark ? "rgba(255,255,255,.5)" : "var(--el-text-tertiary)",
            textDecoration: "line-through",
            textDecorationThickness: "1px",
          }}
        >
          {plan.listPrice}
        </span>
        <span className="text-[46px] font-light leading-none" style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.035em" }}>
          $0
        </span>
        <span className="text-sm" style={{ color: dark ? "var(--el-text-on-dark-muted)" : "var(--el-text-secondary)" }}>
          {plan.unit}
        </span>
      </div>
      <div className="mt-2.5 text-xs" style={{ color: dark ? "#7ee2a8" : "var(--el-positive)" }}>
        Free for now
      </div>
      <div className="mt-6 flex flex-1 flex-col gap-2.5">
        {plan.features.map((feature) => (
          <div key={feature} className="flex gap-2.5 text-sm">
            <span style={{ color: check }}>✓</span> {feature}
          </div>
        ))}
      </div>
      <div className="mt-[26px]">
        <Link
          to="/register"
          className={cn("el-btn w-full", dark ? "el-btn-inverse" : "el-btn-secondary")}
        >
          {plan.cta}
        </Link>
      </div>
    </div>
  );

  if (dark) {
    return (
      <Reveal className="relative">
        <div
          className="pointer-events-none absolute -inset-3 rounded-[34px]"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(4,71,255,.12), rgba(251,250,249,0) 72%)" }}
        />
        <div className="relative h-full">{card}</div>
      </Reveal>
    );
  }
  return <Reveal>{card}</Reveal>;
}
