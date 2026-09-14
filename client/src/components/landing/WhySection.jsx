import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { cn } from "../../lib/utils";

const ROWS = [
  {
    n: "01",
    title: "The right resume, every time",
    body: "Three versions of you, scored per posting. No more guessing which file to attach.",
    dark: false,
  },
  {
    n: "02",
    title: "Specifics, not adjectives",
    body: "Every draft cites real work from your resume against real requirements in the posting.",
    dark: false,
  },
  {
    n: "03",
    title: "Your inbox, your reputation",
    body: "Sent through Gmail OAuth from your own address — replies come back to a thread you own.",
    dark: true,
  },
];

export function WhySection() {
  return (
    <section id="why" className="px-[18px] py-[84px] min-[700px]:px-8">
      <div className="mx-auto grid max-w-[1300px] gap-10 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <Reveal
            as="h2"
            className="font-light"
            style={{
              fontFamily: "var(--el-font-display)",
              fontSize: "clamp(32px,4.2vw,54px)",
              lineHeight: 1.02,
              letterSpacing: "-0.032em",
            }}
          >
            Why tailored beats <span className="font-medium">fast</span>
          </Reveal>
          <Reveal
            as="p"
            delay={90}
            className="mt-5 max-w-[420px] text-base"
            style={{ lineHeight: 1.6, color: "var(--el-text-secondary)" }}
          >
            Mass-applying gets ignored. EmlyAI makes the tailored version the fast version — the same specificity a
            recruiter rewards, in the time a copy-paste takes.
          </Reveal>
          <Reveal delay={180} className="mt-7">
            <Link to="/register" className="el-btn el-btn-primary">
              Start applying free
            </Link>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {ROWS.map((row) => (
            <Reveal
              key={row.n}
              className={cn("flex gap-4 rounded-[20px] p-6", !row.dark && "why-row-hover")}
              style={
                row.dark
                  ? { background: "var(--el-black)", color: "var(--el-text-on-dark)" }
                  : { background: "var(--el-white)", border: "1px solid var(--el-border)" }
              }
            >
              <div
                className="pt-0.5 text-xs"
                style={{
                  fontFamily: "var(--el-font-mono)",
                  color: row.dark ? "rgba(255,255,255,.55)" : "var(--el-text-tertiary)",
                }}
              >
                {row.n}
              </div>
              <div>
                <div
                  className="text-[20px] font-medium"
                  style={{ fontFamily: "var(--el-font-display)", letterSpacing: "-0.012em" }}
                >
                  {row.title}
                </div>
                <p
                  className="mt-1.5 text-sm"
                  style={{ lineHeight: 1.6, color: row.dark ? "var(--el-text-on-dark-muted)" : "var(--el-text-secondary)" }}
                >
                  {row.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
