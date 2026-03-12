import { sendEmail } from "@/lib/email";
import {
  volunteerConfirmationTemplate,
  donationConfirmationTemplate,
} from "@/lib/email-templates";

/**
 * Send volunteer registration confirmation email.
 * Fails gracefully - does not throw.
 */
export async function sendVolunteerConfirmation(
  email: string,
  name: string
): Promise<void> {
  try {
    const { html, text } = volunteerConfirmationTemplate(name);
    const sent = await sendEmail({
      to: email,
      subject: "Thank you for registering as a volunteer",
      html,
      text,
    });
    if (!sent) {
      console.warn("[Email] Volunteer confirmation not sent (SMTP may be disabled)");
    }
  } catch (err) {
    console.error("[Email] Volunteer confirmation error:", err);
  }
}

/**
 * Send donation confirmation email.
 * Fails gracefully - does not throw.
 */
export async function sendDonationConfirmation(
  email: string,
  name: string,
  amount: number,
  receiptNumber: string
): Promise<void> {
  try {
    const { html, text } = donationConfirmationTemplate(name, amount, receiptNumber);
    const sent = await sendEmail({
      to: email,
      subject: `Donation receipt - ${receiptNumber}`,
      html,
      text,
    });
    if (!sent) {
      console.warn("[Email] Donation confirmation not sent (SMTP may be disabled)");
    }
  } catch (err) {
    console.error("[Email] Donation confirmation error:", err);
  }
}
