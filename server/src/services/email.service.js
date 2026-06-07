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
          const safeParagraph = escapeHtml(paragraph).replace(/\n/g, "<br />");
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
};
