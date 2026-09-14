import { RefreshCw } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useGmail } from "../context/GmailContext";

import PageHeader from "../components/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const FieldTile = ({ label, value }) => (
  <label className="block rounded-2xl border border-border bg-surface-sunken px-4 py-3.5">
    <span className="block text-xs text-fg-subtle">{label}</span>
    <span className="mt-1.5 block text-base text-fg">{value || "N/A"}</span>
  </label>
);

const Settings = () => {
  const { user, logout } = useAuth();
  const { gmailConnected, gmailEmail, connectGmail, gmailLoading } = useGmail();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        sub="Manage Gmail integration, account details and session."
      />

      <div className="grid gap-3.5 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardContent className="p-[26px]">
            <h2
              className="font-medium text-fg"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
            >
              Account information
            </h2>
            <p className="mt-1 text-sm text-fg-muted">Your registered account details.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <FieldTile label="Name" value={user?.name} />
              <FieldTile label="Email" value={user?.email} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-full flex-col p-[26px]">
            <h2
              className="font-medium text-fg"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
            >
              Gmail integration
            </h2>
            <p className="mt-1 text-sm text-fg-muted">Used to send applications from your own address.</p>

            <div className="mt-5 flex flex-1 flex-col gap-4 rounded-[18px] border border-border bg-surface-sunken p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <span
                  className={`inline-block rounded-full border border-border bg-elevated px-2.5 py-1 text-[11px] font-semibold ${
                    gmailConnected ? "text-success" : "text-warning"
                  }`}
                >
                  {gmailConnected ? "CONNECTED" : "NOT CONNECTED"}
                </span>

                <p className="mt-2.5 truncate text-base font-medium text-fg">
                  {gmailConnected ? gmailEmail : "No Gmail account connected"}
                </p>
                <p className="mt-1 text-sm text-fg-muted">
                  {gmailConnected
                    ? "Applications will be sent from this Gmail account."
                    : "Google OAuth — no app password needed."}
                </p>
              </div>

              <Button onClick={connectGmail} loading={gmailLoading} className="shrink-0">
                <RefreshCw size={16} />
                {gmailConnected ? "Reconnect Gmail" : "Connect Gmail"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col gap-4 p-[26px] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className="font-medium text-fg"
                style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-md)", letterSpacing: "-0.014em" }}
              >
                Log out
              </h2>
              <p className="mt-1 text-sm text-fg-muted">Sign out of this device securely.</p>
            </div>

            <Button
              variant="outline"
              onClick={logout}
              className="shrink-0 border-border-strong text-danger hover:bg-danger/10 hover:border-danger/30"
            >
              Log out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
