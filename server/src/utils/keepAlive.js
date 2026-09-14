// Periodic self-ping to keep a sleep-prone host (e.g. a free-tier PaaS)
// from spinning down due to inactivity — pings the server's own public
// /api/health endpoint every 13 minutes, under a typical ~15-minute
// idle-shutdown threshold. Targets SERVER_URL (the same env var already
// used elsewhere for the server's public URL); falls back to localhost
// when unset, which is a harmless no-op in local dev.
const PING_INTERVAL_MS = 13 * 60 * 1000;

export const startKeepAlivePing = () => {
  const port = process.env.PORT || 5000;
  const baseUrl = process.env.SERVER_URL || `http://localhost:${port}`;
  const url = `${baseUrl}/api/health`;

  setInterval(async () => {
    try {
      const res = await fetch(url);
      console.log(`[keep-alive] ping ${url} -> ${res.status}`);
    } catch (error) {
      console.error(`[keep-alive] ping ${url} failed:`, error.message);
    }
  }, PING_INTERVAL_MS);

  console.log(`[keep-alive] started — pinging ${url} every 13 minutes`);
};
