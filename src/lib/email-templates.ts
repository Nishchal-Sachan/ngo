import { getOrgName } from "@/lib/env";

const ORG_NAME = getOrgName();

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ORG_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="background: #0F3D73; padding: 16px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 20px;">${ORG_NAME}</h1>
    </div>
    <div style="background: white; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
      ${content}
      <p style="margin-top: 24px; color: #64748b; font-size: 12px;">
        This is an automated message. Please do not reply directly to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function volunteerConfirmationTemplate(name: string): { html: string; text: string } {
  const content = `
    <h2 style="color: #0F3D73; margin-top: 0;">Thank You for Registering!</h2>
    <p>Dear ${name},</p>
    <p>Thank you for registering as a volunteer with ${ORG_NAME}. We are excited to have you on board!</p>
    <p>Our team will reach out to you shortly with more information about volunteer opportunities and how you can contribute.</p>
    <p>Together we can make a difference.</p>
    <p style="margin-bottom: 0;">Warm regards,<br><strong>${ORG_NAME}</strong></p>
  `;
  return {
    html: baseTemplate(content),
    text: `Dear ${name},\n\nThank you for registering as a volunteer with ${ORG_NAME}. We are excited to have you on board!\n\nOur team will reach out to you shortly.\n\nWarm regards,\n${ORG_NAME}`,
  };
}

export function donationConfirmationTemplate(
  name: string,
  amount: number,
  receiptNumber: string
): { html: string; text: string } {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

  const content = `
    <h2 style="color: #0F3D73; margin-top: 0;">Thank You for Your Donation!</h2>
    <p>Dear ${name},</p>
    <p>Thank you for your generous donation of <strong>${formattedAmount}</strong> to ${ORG_NAME}.</p>
    <p>Your support helps us continue our mission of empowering communities and transforming lives.</p>
    <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px;"><strong>Receipt Number:</strong> ${receiptNumber}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px;"><strong>Amount:</strong> ${formattedAmount}</p>
    </div>
    <p>Please save this receipt for your records.</p>
    <p style="margin-bottom: 0;">With gratitude,<br><strong>${ORG_NAME}</strong></p>
  `;
  return {
    html: baseTemplate(content),
    text: `Dear ${name},\n\nThank you for your donation of ${formattedAmount} to ${ORG_NAME}.\n\nReceipt Number: ${receiptNumber}\nAmount: ${formattedAmount}\n\nPlease save this receipt for your records.\n\nWith gratitude,\n${ORG_NAME}`,
  };
}
