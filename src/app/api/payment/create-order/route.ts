import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getRazorpayInstance, getRazorpayKeyId } from "@/lib/razorpay";
import { generateReceiptNumber } from "@/lib/utils";

const MIN_AMOUNT_INR = 1;
const MAX_AMOUNT_INR = 100_000_000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, amount, pan, email } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return errorResponse("Valid name is required", 400, "VALIDATION_ERROR");
    }
    const phoneClean = String(phone || "").replace(/\D/g, "").slice(-10);
    if (phoneClean.length !== 10) {
      return errorResponse("Valid 10-digit phone number is required", 400, "VALIDATION_ERROR");
    }
    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum < MIN_AMOUNT_INR || amountNum > MAX_AMOUNT_INR) {
      return errorResponse(
        `Amount must be between ${MIN_AMOUNT_INR} and ${MAX_AMOUNT_INR} INR`,
        400,
        "VALIDATION_ERROR"
      );
    }
    const panClean = String(pan || "").trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panClean)) {
      return errorResponse("Valid PAN is required (e.g., ABCDE1234F)", 400, "VALIDATION_ERROR");
    }

    const razorpay = getRazorpayInstance();
    const receiptNumber = generateReceiptNumber();

    const order = await razorpay.orders.create({
      amount: Math.round(amountNum * 100),
      currency: "INR",
      receipt: receiptNumber,
      notes: {
        name: name.trim(),
        phone: phoneClean,
        pan: panClean,
        ...(email?.trim() && { email: email.trim().toLowerCase() }),
      },
    });

    return successResponse({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: getRazorpayKeyId(),
    });
  } catch (err) {
    console.error("Create order error:", err);
    return errorResponse("Failed to create payment order", 500, "INTERNAL_ERROR");
  }
}
