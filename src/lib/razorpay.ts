import Razorpay from "razorpay";
import crypto from "crypto";
import { getRazorpayConfig } from "@/lib/env";

export function getRazorpayInstance(): Razorpay {
  const config = getRazorpayConfig();
  if (!config) {
    throw new Error(
      "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment"
    );
  }
  return new Razorpay({ key_id: config.keyId, key_secret: config.keySecret });
}

export function getRazorpayKeyId(): string {
  const config = getRazorpayConfig();
  if (!config) {
    throw new Error("RAZORPAY_KEY_ID must be set in environment");
  }
  return config.keyId;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const config = getRazorpayConfig();
  if (!config) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", config.keySecret)
    .update(body)
    .digest("hex");
  return expected === signature;
}
