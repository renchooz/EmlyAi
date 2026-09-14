import { useState } from "react";
import toast from "react-hot-toast";
import {
  Send,
  Building2,
  Mail,
  FileText,
  CheckCircle2,
  Wand2,
} from "lucide-react";

import { useAI } from "../context/AIContext";
import { useGmail } from "../context/GmailContext";
import { useResume } from "../context/ResumeContext";
import { sendEmailApi } from "../api/emailApi";

import PageHeader from "../components/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";

const OneClickApply = () => {
  const { previewApplication, applicationPreview, setApplicationPreview, aiLoading } = useAI();
  const { resumes } = useResume();
  const { gmailConnected, connectGmail, gmailLoading, fetchGmailStatus } = useGmail();

  const [sending, setSending] = useState(false);
  const [sentResult, setSentResult] = useState(null);

  const [formData, setFormData] = useState({
    companyName: "",
    to: "",
    jobDescription: "",
  });

  const [editableData, setEditableData] = useState({
    subject: "",
    emailBody: "",
    resumeId: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGeneratePreview = async (e) => {
    e.preventDefault();
    setSentResult(null);

    const preview = await previewApplication(formData);

    if (preview) {
      setEditableData({
        subject: preview.email?.subject || "",
        emailBody: preview.email?.body || "",
        resumeId: preview.selectedResume?.id || "",
      });
    }
  };

  const handleEditableChange = (e) => {
    setEditableData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFinalSend = async () => {
    try {
      if (!editableData.resumeId || !editableData.subject || !editableData.emailBody) {
        toast.error("Resume, subject and email body are required");
        return;
      }

      setSending(true);

      const { data } = await sendEmailApi({
        to: applicationPreview.to,
        subject: editableData.subject,
        emailBody: editableData.emailBody,
        resumeId: editableData.resumeId,
      });

      setSentResult(data.email);
      toast.success("Application sent successfully");
    } catch (error) {
      toast.error(error.message || "Failed to send application");

      // The server clears the stored Gmail connection when it detects an
      // expired/revoked token (an "invalid_grant" from Google) — re-check
      // status so the sidebar/settings/this page's own banner immediately
      // reflect "not connected" and prompt reconnecting, rather than the
      // user hitting the same opaque error again on retry.
      if (/reconnect gmail|no longer connected|not connected/i.test(error.message || "")) {
        fetchGmailStatus();
      }
    } finally {
      setSending(false);
    }
  };

  const selectedResumeName =
    resumes.find((resume) => resume._id === editableData.resumeId)?.originalName ||
    applicationPreview?.selectedResume?.name;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="One Click Apply"
        title="Preview before sending"
        sub="Generate the application, edit the email, swap the resume if needed, then send it from your Gmail."
      />

      {!gmailConnected && (
        <div
          className="flex flex-wrap items-center gap-4 rounded-2xl border p-[18px] sm:px-[22px]"
          style={{
            background: "color-mix(in srgb, var(--color-warning) 12%, white)",
            borderColor: "color-mix(in srgb, var(--color-warning) 25%, transparent)",
          }}
        >
          <div>
            <p className="font-medium text-warning">Connect Gmail to send applications</p>
            <p className="mt-1 text-sm text-fg-muted">Emails go out from your own account using Google OAuth.</p>
          </div>
          <div className="flex-1" />
          <Button size="sm" onClick={connectGmail} loading={gmailLoading}>
            Connect Gmail
          </Button>
        </div>
      )}

      <div className="grid gap-3.5 lg:grid-cols-2">
        <Card>
          <CardContent className="p-[26px]">
            <h2
              className="font-medium text-fg"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
            >
              Application details
            </h2>
            <p className="mt-1 text-sm text-fg-muted">EmlyAI picks the resume and drafts the email.</p>

            <form onSubmit={handleGeneratePreview} className="mt-5 space-y-3">
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="pl-9"
                />
              </div>

              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
                <Input
                  type="email"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="hr@company.com"
                  className="pl-9"
                />
              </div>

              <Textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={9}
                placeholder="Paste job description here..."
              />

              <Button type="submit" loading={aiLoading} disabled={!gmailConnected} className="w-full">
                {!aiLoading && <Wand2 size={18} />}
                Generate preview
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-24 overflow-hidden">
          {!applicationPreview ? (
            <CardContent className="flex min-h-[480px] flex-col items-center justify-center p-[26px] text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-sunken text-fg-muted">
                <Send size={32} />
              </div>

              <h2 className="text-xl font-semibold text-fg">Waiting for preview</h2>

              <p className="mt-2 max-w-md text-sm text-fg-muted">
                AI-selected resume and editable email preview will appear here before sending.
              </p>
            </CardContent>
          ) : (
            <>
              <div className="flex items-center gap-2.5 border-b border-border bg-surface-sunken px-[18px] py-3.5">
                <span className="text-xs text-fg-subtle" style={{ fontFamily: "var(--font-mono)" }}>
                  preview
                </span>
                <div className="flex-1" />
                <Badge variant="success">
                  {sentResult ? <CheckCircle2 size={12} /> : null}
                  {sentResult ? "sent" : "ready"}
                </Badge>
              </div>

              <CardContent className="space-y-5 p-[26px]">
                {sentResult && (
                  <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
                    <CheckCircle2 className="mt-0.5 text-success" size={20} />
                    <div>
                      <p className="font-semibold text-success">Application sent successfully</p>
                      <p className="mt-1 text-sm text-fg-muted">Sent from {sentResult.from}</p>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-border bg-surface-sunken p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-fg-muted" />
                    <h3 className="text-sm font-semibold text-fg">AI recommended resume</h3>
                  </div>

                  <p className="text-sm text-fg">{applicationPreview.selectedResume?.name}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-fg-muted">Match score</span>
                    <span className="text-base font-semibold text-success">
                      {applicationPreview.selectedResume?.matchScore}%
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {applicationPreview.selectedResume?.reason}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-fg-muted">Change resume</label>
                  <select
                    name="resumeId"
                    value={editableData.resumeId}
                    onChange={handleEditableChange}
                    className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg outline-none focus:border-brand-500"
                  >
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.originalName}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-fg-subtle">Currently selected: {selectedResumeName}</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-fg-muted">Subject</label>
                  <Input name="subject" value={editableData.subject} onChange={handleEditableChange} />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-fg-muted">Email body</label>
                  <Textarea
                    name="emailBody"
                    value={editableData.emailBody}
                    onChange={handleEditableChange}
                    rows={10}
                    className="custom-scroll leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-sunken px-3.5 py-2.5 text-xs text-fg-subtle">
                  <span
                    className="rounded-md border border-border bg-elevated px-2 py-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    resume attached
                  </span>
                  automatically
                </div>

                <Button
                  onClick={handleFinalSend}
                  loading={sending}
                  disabled={!gmailConnected}
                  className="w-full"
                >
                  <Send size={18} />
                  Send from Gmail
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setApplicationPreview(null);
                    setSentResult(null);
                    setEditableData({ subject: "", emailBody: "", resumeId: "" });
                  }}
                >
                  Reset preview
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OneClickApply;
