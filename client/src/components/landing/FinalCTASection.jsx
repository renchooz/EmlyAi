import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

export function FinalCTASection() {
  return (
    <section className="px-[18px] pb-12 min-[700px]:px-8">
      <Reveal
        className="relative mx-auto max-w-[1300px] overflow-hidden rounded-[32px] px-[22px] py-[60px] text-center min-[700px]:px-10 min-[700px]:py-24"
        style={{ background: "var(--el-black)", color: "var(--el-text-on-dark)" }}
      >
        <img
          src="/landing/orb-sunset.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute hidden sm:block"
          style={{
            left: "50%",
            bottom: -320,
            transform: "translateX(-50%)",
            width: 720,
            opacity: 0.48,
            filter: "blur(4px)",
            animation: "el-orb 30s ease-in-out infinite",
          }}
        />
        <div className="relative">
          <h2
            className="mx-auto max-w-[680px] font-light"
            style={{ fontFamily: "var(--el-font-display)", fontSize: "clamp(32px,4.6vw,58px)", lineHeight: 1.02, letterSpacing: "-0.032em" }}
          >
            Your next application, already written
          </h2>
          <p className="mx-auto mt-5 max-w-[440px] text-base" style={{ color: "var(--el-text-on-dark-muted)" }}>
            Connect Gmail, upload your resumes, paste a posting. That's the whole setup.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="el-btn el-btn-lg el-btn-inverse">
              Start applying free
            </Link>
            <a href="#demo" className="el-btn el-btn-lg el-btn-inverse-ghost">
              See the demo again
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
