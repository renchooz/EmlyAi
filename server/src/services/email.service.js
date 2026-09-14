import fs from "fs";
import path from "path";
import { google } from "googleapis";

import GmailToken from "../models/GmailToken.js";
import { createOAuthClient } from "./gmailOAuth.service.js";

const escapeHtml = (text = "") => {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatEmailHtml = (body = "") => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.7; color: #111827;">
      ${String(body)
        .split(/\n\s*\n/)
        .map((paragraph) => {
          const safeParagraph = escapeHtml(paragraph)
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br />");

          return `<p style="margin: 0 0 14px;">${safeParagraph}</p>`;
        })
        .join("")}
    </div>
  `;
};

const sanitizeSubject = (subject = "") => {
  return String(subject)
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
};

const makeBody = ({
  to,
  from,
  subject,
  body,
  attachmentPath,
  attachmentName,
}) => {
  const boundary = "boundary_" + Date.now();

  const safeSubject = sanitizeSubject(subject);
  const htmlBody = Buffer.from(formatEmailHtml(body), "utf-8").toString(
    "base64",
  );
  const attachment = fs.readFileSync(attachmentPath).toString("base64");

  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${safeSubject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    htmlBody,
    "",
    `--${boundary}`,
    `Content-Type: application/pdf; name="${attachmentName}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${attachmentName}"`,
    "",
    attachment,
    "",
    `--${boundary}--`,
  ];

  const message = messageParts.join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// "invalid_grant" from Google's token endpoint means the stored refresh
// token itself is no longer usable — access was revoked from the Google
// Account, the account's password/security settings changed, or (very
// commonly for a personal/dev project) the Google Cloud OAuth consent
// screen is still in "Testing" publishing status, where refresh tokens
// expire after 7 days regardless of use. Recovering from it always means
// the user has to reconnect — there's no silent refresh that fixes it.
const isInvalidGrantError = (error) => {
  const code = error?.response?.data?.error;
  return code === "invalid_grant" || /invalid_grant/i.test(error?.message || "");
};

export const sendGmailWithAttachment = async ({
  userId,
  to,
  subject,
  body,
  resume,
}) => {
  const gmailToken = await GmailToken.findOne({ user: userId });

  if (!gmailToken) {
    throw new Error("Gmail is not connected");
  }

  const oauth2Client = createOAuthClient();

  oauth2Client.setCredentials({
    access_token: gmailToken.accessToken,
    refresh_token: gmailToken.refreshToken,
    expiry_date: gmailToken.expiryDate,
  });

  // googleapis silently refreshes an expired access token in-memory using
  // the refresh token; without this listener that refreshed token was never
  // written back, so every send re-used the stale stored one. Persist it.
  oauth2Client.on("tokens", (tokens) => {
    const update = {};
    if (tokens.access_token) update.accessToken = tokens.access_token;
    if (tokens.expiry_date) update.expiryDate = tokens.expiry_date;
    if (tokens.refresh_token) update.refreshToken = tokens.refresh_token;

    if (Object.keys(update).length) {
      GmailToken.updateOne({ user: userId }, update).catch(() => {});
    }
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const attachmentPath = path.resolve(resume.filePath);

  const raw = makeBody({
    to,
    from: gmailToken.email,
    subject,
    body,
    attachmentPath,
    attachmentName: resume.originalName,
  });

  try {
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });

    return {
      messageId: response.data.id,
      from: gmailToken.email,
    };
  } catch (error) {
    if (isInvalidGrantError(error)) {
      // Clear the stale connection so the UI stops claiming Gmail is
      // connected and the user is prompted to reconnect, instead of hitting
      // this same opaque error on every future send.
      await GmailToken.deleteOne({ user: userId }).catch(() => {});

      throw new Error(
        "Your Gmail connection has expired or was revoked. Please reconnect Gmail in Settings to keep sending applications."
      );
    }

    throw error;
  }
};
