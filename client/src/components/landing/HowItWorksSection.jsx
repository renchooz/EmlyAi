import { motion } from "framer-motion";
import {
  Upload,
  FileSearch,
  Brain,
  MailPlus,
  Send,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

const steps = [
  {
    icon: Upload,
    title: "Upload resumes",
    text: "Add multiple resumes for different roles like MERN, DevOps, Frontend or Backend.",
  },
  {
    icon: FileSearch,
    title: "Paste job description",
    text: "Drop the JD and let AI understand the role, skills and expectations.",
  },
  {
    icon: Brain,
    title: "AI picks best resume",
    text: "The system compares every resume and selects the strongest match automatically.",
  },
  {
    icon: MailPlus,
    title: "Generate email",
    text: "AI writes a tailored job application email and cover letter using your resume.",
  },
  {
    icon: Send,
    title: "Send from Gmail",
    text: "Send the email with resume attachment directly from your connected Gmail account.",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative bg-slate-950 px-4 py-24 text-white"
    >
      <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400">
            How it works
          </p>

          <h2 className="text-3xl font-bold md:text-5xl">
            From JD to sent email in
            <span className="text-violet-400"> one smooth flow</span>
          </h2>

          <p className="mt-4 text-slate-400">
            EmlyAi connects resume analysis, email generation and Gmail
            sending into one simple workflow.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="relative"
            >
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <step.icon size={22} />
                  </div>

                  <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs text-slate-300">
                    {index + 1}
                  </div>

                  <h3 className="text-base font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {step.text}
                  </p>
                </CardContent>
              </Card>

              {index !== steps.length - 1 && (
                <div className="absolute right-[-14px] top-1/2 hidden h-px w-7 bg-violet-500/30 lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;