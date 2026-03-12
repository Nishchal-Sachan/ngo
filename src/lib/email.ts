import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/lib/env";

export function isEmailConfigured(): boolean {
  return getSmtpConfig() !== null;
}

function getTransporter() {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
  }
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn("[Email] SMTP not configured, skipping send");
    return false;
  }

  try {
    const transporter = getTransporter();
    const config = getSmtpConfig();
    if (!config) return false;
    await transporter.sendMail({
      from: config.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (err) {
    console.error("[Email] Send failed:", err);
    return false;
  }
}
