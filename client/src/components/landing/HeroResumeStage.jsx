import { useTilt } from "./useTilt";

const SKILL_CHIPS = [
  { label: "React", pos: "left-1/2 top-0" },
  { label: "TypeScript", pos: "left-full top-1/2" },
  { label: "Design systems", pos: "left-1/2 top-full" },
  { label: "Leadership", pos: "left-0 top-1/2" },
];

/**
 * The hero's CSS-3D "resume stage" (design handoff §A2 — right column):
 * a mouse-tilted stack of resume cards orbited by skill chips, pure CSS 3D,
 * no three.js/canvas. Every value below (sizes, transforms, timings) is
 * exact per the handoff; styling uses Tailwind + this page's `--el-*` CSS
 * variables (see `styles/landing.css`) rather than inline style objects,
 * except the one genuinely dynamic value — the mouse-tilt transform, which
 * has to be inline because it's computed from live mouse position.
 * Content (Priya Nair / 86% match) is fixed marketing illustration, matching
 * the handoff — this is a public, logged-out page with no real resume data.
 */
export function HeroResumeStage() {
  const { rx, ry } = useTilt();

  return (
    <div
      className="relative h-[520px] [perspective:1400px] [perspective-origin:50%_45%]
                 min-[700px]:max-[999px]:origin-[50%_45%] min-[700px]:max-[999px]:scale-[.84]
                 max-[699px]:h-[380px] max-[699px]:origin-[50%_45%] max-[699px]:scale-[.66]"
    >
      <div
        className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-[280ms] ease-[cubic-bezier(.2,0,0,1)]"
        style={{ transform: `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)` }}
      >
        {/* Floor glow */}
        <div
          className="absolute left-1/2 top-[58%] h-[420px] w-[420px] -ml-[210px] -mt-[210px] rounded-full [transform:rotateX(74deg)]
                     [background:radial-gradient(circle_at_50%_50%,rgba(4,71,255,.1),rgba(4,71,255,0)_66%)]"
        />

        {/* Orbit ring + skill chips */}
        <div
          className="absolute left-1/2 top-1/2 h-[248px] w-[248px] -ml-[124px] -mt-[124px] [transform-style:preserve-3d]
                     animate-[el-orbit_26s_linear_infinite]"
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-[var(--el-grey-300)]" />
          {SKILL_CHIPS.map((chip) => (
            <div key={chip.label} className={`absolute -translate-x-1/2 -translate-y-1/2 ${chip.pos}`}>
              <div className="animate-[el-counter-orbit_26s_linear_infinite]">
                <span className="el-chip">{chip.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Resume stack */}
        <div className="absolute left-1/2 top-1/2 h-[340px] w-[260px] -ml-[130px] -mt-[190px] [transform-style:preserve-3d]">
          <div
            className="absolute inset-0 rounded-[18px] border border-[var(--el-border)] bg-[var(--el-white)] p-5
                       shadow-[0_30px_60px_-34px_rgba(20,18,15,.45)] [transform:translate3d(-54px,26px,-40px)_rotate(-9deg)]"
          >
            <div className="h-2 w-[52%] rounded bg-[var(--el-grey-200)]" />
            <div className="mt-3.5 flex flex-col gap-1.5">
              <div className="h-1.5 rounded-full bg-[var(--el-grey-150)]" />
              <div className="h-1.5 w-[82%] rounded-full bg-[var(--el-grey-150)]" />
              <div className="h-1.5 w-[64%] rounded-full bg-[var(--el-grey-150)]" />
            </div>
          </div>

          <div
            className="absolute inset-0 rounded-[18px] border border-[var(--el-border)] bg-[var(--el-white)] p-5
                       shadow-[0_30px_60px_-34px_rgba(20,18,15,.4)] [transform:translate3d(44px,14px,10px)_rotate(7deg)]"
          >
            <div className="h-2 w-[44%] rounded bg-[var(--el-grey-200)]" />
            <div className="mt-3.5 flex flex-col gap-1.5">
              <div className="h-1.5 rounded-full bg-[var(--el-grey-150)]" />
              <div className="h-1.5 w-[74%] rounded-full bg-[var(--el-grey-150)]" />
              <div className="h-1.5 w-[58%] rounded-full bg-[var(--el-grey-150)]" />
            </div>
          </div>

          <div
            className="absolute inset-0 rounded-[20px] border border-[var(--el-black)] bg-[var(--el-white)] p-[22px]
                       shadow-[0_48px_90px_-40px_rgba(20,18,15,.55)] [transform-style:preserve-3d]
                       animate-[el-lift_7s_cubic-bezier(.2,0,0,1)_infinite]"
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-[var(--el-text-tertiary)] [font-family:var(--el-font-mono)]">
                frontend-senior.pdf
              </div>
              <span className="rounded-full bg-[var(--el-black)] px-2.5 py-1 text-[11px] font-medium text-[var(--el-white)]">
                picked
              </span>
            </div>
            <div className="mt-4 text-[20px] font-medium [font-family:var(--el-font-display)] [letter-spacing:-0.02em]">
              Priya Nair
            </div>
            <div className="text-[12px] text-[var(--el-text-secondary)]">Senior Frontend Engineer</div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="h-1.5 rounded-full bg-[var(--el-grey-150)]" />
              <div className="h-1.5 w-[88%] rounded-full bg-[var(--el-grey-150)]" />
              <div className="h-1.5 w-[70%] rounded-full bg-[var(--el-grey-150)]" />
              <div className="h-1.5 w-[78%] rounded-full bg-[var(--el-grey-150)]" />
            </div>
            <div className="mt-[22px] flex items-center gap-2.5 border-t border-[var(--el-border)] pt-4">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--el-grey-150)]">
                <div className="h-full w-[86%] rounded-full bg-[var(--el-accent-violet)] transition-[width] duration-[400ms] ease-linear" />
              </div>
              <div className="text-[12px] [font-family:var(--el-font-mono)]">86</div>
            </div>
          </div>
        </div>

        {/* Floating "Sent from your Gmail" pill */}
        <div
          className="absolute bottom-[22px] left-1/2 flex items-center gap-2.5 rounded-full bg-[var(--el-black)] px-4 py-2.5
                     text-[13px] font-medium text-[var(--el-white)] shadow-[0_20px_40px_-22px_rgba(0,0,0,.6)]
                     [transform:translateX(-50%)_translateZ(80px)] animate-[el-hover_6s_ease-in-out_infinite]"
        >
          <span className="h-[7px] w-[7px] rounded-full bg-[var(--el-demo-green)]" />
          Sent from your Gmail
        </div>
      </div>
    </div>
  );
}
