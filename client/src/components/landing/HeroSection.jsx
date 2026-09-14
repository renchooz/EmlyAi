import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { ParallaxOrb } from "./ParallaxOrb";
import { HeroResumeStage } from "./HeroResumeStage";
import { ProductDemo, DEMO_STEPS } from "./ProductDemo";
import { useDemoLoop } from "./useDemoLoop";

export function HeroSection() {
  const { step, t, reduced, replay } = useDemoLoop(DEMO_STEPS);

  return (
    <section
      id="demo"
      className="relative overflow-hidden px-[18px] pt-[40px] pb-[56px] min-[700px]:px-8 min-[700px]:pt-16 min-[700px]:pb-20"
    >
      <ParallaxOrb
        src="/landing/orb-violet.png"
        k={0.12}
        animation="el-orb 28s ease-in-out infinite"
        className="hidden sm:block"
        style={{ right: -200, top: -140, width: 560, opacity: 0.42, filter: "blur(8px)" }}
      />
      <ParallaxOrb
        src="/landing/orb-meadow.png"
        k={-0.08}
        animation="el-orb 34s ease-in-out infinite reverse"
        className="hidden sm:block"
        style={{ left: -160, bottom: -220, width: 440, opacity: 0.3, filter: "blur(10px)" }}
      />

      <div className="relative mx-auto max-w-[1300px]">
        <div className="grid items-center gap-10 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <div className="max-w-[760px]">
            <Reveal className="el-eyebrow-pill">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  border: "2px solid var(--el-grey-200)",
                  borderTopColor: "var(--el-accent-violet)",
                  animation: reduced ? undefined : "el-spin 1s linear infinite",
                }}
              />
              Watch it work — no signup
            </Reveal>

            <Reveal
              as="h1"
              delay={90}
              className="mt-6 font-light"
              style={{
                fontFamily: "var(--el-font-display)",
                fontSize: "clamp(42px, 6.4vw, 82px)",
                lineHeight: 0.98,
                letterSpacing: "-0.036em",
                textWrap: "balance",
              }}
            >
              One job description.
              <br />
              <span className="font-medium">One perfect application.</span>
            </Reveal>

            <Reveal
              as="p"
              delay={180}
              className="mt-6 max-w-[520px] text-lg"
              style={{ lineHeight: 1.55, color: "var(--el-text-secondary)" }}
            >
              EmlyAI ranks your resumes, writes the email, attaches the winner and sends it from your Gmail. The
              demo below is the real flow, running on a loop.
            </Reveal>

            <Reveal delay={270} className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register" className="el-btn el-btn-lg el-btn-primary">
                Start applying free
              </Link>
              <button type="button" onClick={replay} className="el-btn el-btn-lg el-btn-ghost">
                ↻ Replay demo
              </button>
            </Reveal>
          </div>

          <HeroResumeStage />
        </div>

        <Reveal>
          <ProductDemo step={step} t={t} reduced={reduced} />
        </Reveal>
      </div>
    </section>
  );
}
