import { useState } from "react";
import toast from "react-hot-toast";
import { FileText, Building2, Clipboard, Download, Sparkles } from "lucide-react";

import { useResume } from "../context/ResumeContext";
import { useAI } from "../context/AIContext";

import PageHeader from "../components/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const CoverLetter = () => {
  const { resumes } = useResume();
  const { generateCoverLetter, aiLoading } = useAI();

  const [resumeId, setResumeId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [editableLetter, setEditableLetter] = useState("");
  const [generatedFor, setGeneratedFor] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();

    const result = await generateCoverLetter({ resumeId, companyName, jobDescription });

    if (result) {
      setEditableLetter(result.coverLetter || "");
      setGeneratedFor({
        companyName,
        resumeName: resumes.find((resume) => resume._id === resumeId)?.originalName || "Selected resume",
      });
    }
  };

  const handleCopy = async () => {
    if (!editableLetter.trim()) {
      toast.error("Nothing to copy");
      return;
    }

    await navigator.clipboard.writeText(editableLetter);
    toast.success("Cover letter copied");
  };

  // Client-side export of the current draft — no backend endpoint needed
  // since it's just the already-generated text the user can already edit.
  const handleDownload = () => {
    if (!editableLetter.trim()) {
      toast.error("Nothing to download");
      return;
    }

    const blob = new Blob([editableLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cover-letter${generatedFor?.companyName ? `-${generatedFor.companyName}` : ""}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cover Letter"
        title="Generate a cover letter"
        sub="A tailored letter built from your real experience — editable and ready to copy."
      />

      <div className="grid gap-3.5 lg:grid-cols-2">
        <Card>
          <CardContent className="p-[26px]">
            <h2
              className="font-medium text-fg"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
            >
              Cover letter details
            </h2>
            <p className="mt-1 text-sm text-fg-muted">Pick a resume and paste the posting.</p>

            <form onSubmit={handleGenerate} className="mt-5 space-y-3">
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg outline-none focus:border-brand-500"
              >
                <option value="">Choose a resume</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.originalName}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="pl-9"
                />
              </div>

              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={11}
                placeholder="Paste job description here..."
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" loading={aiLoading}>
                  {!aiLoading && <Sparkles size={18} />}
                  Generate cover letter
                </Button>
                <span className="text-xs text-fg-subtle">≈ 12 seconds</span>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-24">
          <CardContent className="p-[26px]">
            {!editableLetter ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-sunken text-fg-muted">
                  <FileText size={32} />
                </div>

                <h2 className="text-xl font-semibold text-fg">Waiting for cover letter</h2>

                <p className="mt-2 max-w-md text-sm text-fg-muted">
                  Your editable cover letter will appear here after generation.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <h2
                    className="font-medium text-fg"
                    style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
                  >
                    Draft
                  </h2>
                  <div className="flex-1" />
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    <Clipboard size={14} />
                    Copy
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownload}>
                    <Download size={14} />
                    Download
                  </Button>
                </div>

                {generatedFor && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
                      <p className="text-xs text-fg-subtle">Company</p>
                      <p className="mt-1 truncate font-medium text-fg">{generatedFor.companyName || "N/A"}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
                      <p className="text-xs text-fg-subtle">Resume used</p>
                      <p className="mt-1 truncate font-medium text-fg">{generatedFor.resumeName}</p>
                    </div>
                  </div>
                )}

                <Textarea
                  value={editableLetter}
                  onChange={(e) => setEditableLetter(e.target.value)}
                  rows={18}
                  className="custom-scroll leading-relaxed"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetter;
