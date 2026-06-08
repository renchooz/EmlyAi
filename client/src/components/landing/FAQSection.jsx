import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const faqs = [
  {
    question: "Does EmlyAi send emails from my Gmail?",
    answer:
      "Yes. Once you connect Gmail using Google OAuth, emails are sent from your own Gmail account with your selected resume attached.",
  },
  {
    question: "Do I need to create a Gmail app password?",
    answer:
      "No. EmlyAi uses Google OAuth, so users do not need to enable app passwords or change Gmail settings.",
  },
  {
    question: "Can I upload multiple resumes?",
    answer:
      "Yes. You can upload multiple resumes and the AI can automatically select the best one based on the job description.",
  },
  {
    question: "Can I generate a cover letter?",
    answer:
      "Yes. The app can generate both tailored job application emails and cover letters using your resume and the job description.",
  },
  {
    question: "Is this a job portal?",
    answer:
      "No. It is an AI resume sender. You provide the job description and HR email, and the app helps you prepare and send the application faster.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="faq" className="bg-slate-950 px-4 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400">
            FAQ
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            Questions before you start?
          </h2>

          <p className="mt-4 text-slate-400">
            Quick answers about Gmail, resumes, AI analysis and email sending.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <motion.div
                key={faq.question}
                layout
                className={cn(
                  "overflow-hidden rounded-2xl border backdrop-blur transition-colors",
                  isOpen
                    ? "border-violet-500/40 bg-violet-500/[0.06]"
                    : "border-white/10 bg-white/[0.04]"
                )}
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-medium">{faq.question}</span>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown
                      className={cn(
                        "shrink-0 transition-colors",
                        isOpen ? "text-violet-300" : "text-slate-400"
                      )}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.28, ease: "easeOut" },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <div className="px-5 pb-5 text-sm leading-6 text-slate-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;