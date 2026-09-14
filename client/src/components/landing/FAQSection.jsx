import { useState } from "react";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "Does EmlyAI send from my own Gmail?",
    a: "Yes. Google OAuth connects your account and each application is sent from your address with the selected resume attached — no app password, no third-party sender.",
  },
  {
    q: "Can I upload multiple resumes?",
    a: "Yes, and you should. EmlyAI scores every version against the posting and attaches the one most likely to pass screening.",
  },
  {
    q: "Can I edit the draft before sending?",
    a: "Nothing sends without your click. Subject, body and attachment are all editable.",
  },
  {
    q: "Does it write cover letters?",
    a: "Yes — a matching cover letter is generated on request for postings that ask for one.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-[18px] pt-[84px] pb-[96px] min-[700px]:px-8">
      <div className="mx-auto max-w-[880px]">
        <Reveal
          as="h2"
          className="mb-8 font-light"
          style={{ fontFamily: "var(--el-font-display)", fontSize: "clamp(28px,3.2vw,42px)", letterSpacing: "-0.028em" }}
        >
          Questions before you start
        </Reveal>
        <div className="flex flex-col gap-2.5">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} className="el-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-4 px-[22px] py-[19px] text-left text-base font-medium"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1">{item.q}</span>
                  <span
                    className="flex-none text-[22px] leading-none"
                    style={{
                      color: "var(--el-text-tertiary)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform .3s cubic-bezier(.2,0,0,1)",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 220 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height .34s cubic-bezier(.2,0,0,1), opacity .24s ease",
                  }}
                >
                  <p className="px-[22px] pb-5 text-sm" style={{ lineHeight: 1.7, color: "var(--el-text-secondary)" }}>
                    {item.a}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
