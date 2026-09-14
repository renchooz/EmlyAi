import { useMemo, useState } from "react";
import { Mail, Search, Eye, CheckCircle2, XCircle, FileText, Calendar } from "lucide-react";

import { useEmailHistory } from "../context/EmailHistoryContext";

import PageHeader from "../components/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

const EmailHistory = () => {
  const { emails, emailLoading } = useEmailHistory();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState(null);

  const filteredEmails = useMemo(() => {
    return (emails || []).filter((email) => {
      const searchText = `
        ${email.subject || ""}
        ${email.to || ""}
        ${email.from || ""}
        ${email.resume?.originalName || ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || email.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [emails, searchTerm, statusFilter]);

  const sentCount = emails?.filter((email) => email.status === "sent").length || 0;
  const failedCount = emails?.filter((email) => email.status === "failed").length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Email History"
        title="Sent applications"
        sub="Every email sent from your Gmail, the resume attached, and its delivery status."
      />

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject, company or resume…"
            className="h-11 w-full rounded-full border border-border bg-elevated pl-10 pr-4 text-sm text-fg outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-full border border-border bg-elevated px-4 text-sm text-fg outline-none focus:border-brand-500"
        >
          <option value="all">All status</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>

        <span className="rounded-full bg-success/10 px-3.5 py-2 text-sm font-medium text-success">
          Sent {sentCount}
        </span>
        <span className="rounded-full bg-surface-sunken px-3.5 py-2 text-sm font-medium text-fg-muted">
          Failed {failedCount}
        </span>
      </div>

      {emailLoading ? (
        <Card>
          <CardContent className="p-10 text-center text-fg-muted">Loading email history…</CardContent>
        </Card>
      ) : filteredEmails.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No emails found"
          description="Your sent applications will appear here after using one-click apply or email sending."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          {filteredEmails.map((email, index) => (
            <div
              key={email._id}
              className={`flex items-center gap-4 p-[18px] transition-colors hover:bg-surface-sunken sm:px-[22px] ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] bg-surface-sunken text-sm font-semibold text-fg">
                {(email.to || "?").charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{email.subject || "No subject"}</p>
                <p className="mt-0.5 truncate text-xs text-fg-subtle">
                  {email.resume?.originalName || "No resume"} · {email.to}
                </p>
              </div>

              <Badge variant={email.status === "sent" ? "success" : "destructive"} className="hidden sm:inline-flex">
                {email.status === "sent" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {email.status}
              </Badge>

              <span
                className="hidden whitespace-nowrap text-xs text-fg-subtle md:inline"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {new Date(email.createdAt).toLocaleDateString()}
              </span>

              <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(email)}>
                <Eye size={15} />
                <span className="hidden sm:inline">View</span>
              </Button>
            </div>
          ))}
        </Card>
      )}

      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="max-w-lg">
          {selectedEmail && (
            <>
              <Badge variant={selectedEmail.status === "sent" ? "success" : "destructive"} className="mb-3">
                {selectedEmail.status}
              </Badge>

              <DialogTitle>Email details</DialogTitle>
              <DialogDescription>
                {new Date(selectedEmail.createdAt).toLocaleString()}
              </DialogDescription>

              <div className="custom-scroll mt-5 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                <DetailRow label="From" value={selectedEmail.from || "N/A"} />
                <DetailRow label="To" value={selectedEmail.to || "N/A"} />
                <DetailRow label="Subject" value={selectedEmail.subject || "N/A"} />
                <DetailRow label="Resume used" value={selectedEmail.resume?.originalName || "N/A"} icon={FileText} />
                <DetailRow label="Message ID" value={selectedEmail.messageId || "N/A"} />

                {selectedEmail.error && <DetailRow label="Error" value={selectedEmail.error} danger />}

                <div className="rounded-xl border border-border bg-surface-sunken p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-fg-subtle">
                    <Calendar size={13} />
                    Email body
                  </p>
                  <div className="custom-scroll max-h-[280px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-fg">
                    {selectedEmail.body || "No body available"}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DetailRow = ({ label, value, danger }) => (
  <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
    <p className="text-xs text-fg-subtle">{label}</p>
    <p className={`mt-1 break-words text-sm ${danger ? "text-danger" : "text-fg"}`}>{value}</p>
  </div>
);

export default EmailHistory;
