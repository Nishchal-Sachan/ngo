import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Donation from "@/models/Donation";
import { generateReceiptNumber } from "@/lib/utils";
import { getRazorpayInstance, verifyPaymentSignature } from "@/lib/razorpay";
import { sendDonationConfirmation } from "@/services/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      receipt,
      name,
      email,
    } = body;

    if (!orderId || !paymentId || !signature) {
      return errorResponse("Invalid payment verification data", 400, "VALIDATION_ERROR");
    }

    if (!verifyPaymentSignature(orderId, paymentId, signature)) {
      return errorResponse("Payment verification failed", 400, "INVALID_SIGNATURE");
    }

    await connectDB();
    const existing = await Donation.findOne({ paymentId });

    if (existing) {
      return successResponse(
        {
          receiptNumber: existing.receiptNumber ?? existing.paymentId ?? "",
          amount: existing.amount,
          name: existing.donorName,
        },
        200,
        "Payment already verified"
      );
    }

    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== "captured") {
      return errorResponse("Payment was not successful", 400, "PAYMENT_NOT_CAPTURED");
    }

    if (payment.order_id !== orderId) {
      return errorResponse("Order ID mismatch", 400, "ORDER_MISMATCH");
    }

    const amountInr = Number(payment.amount) / 100;
    const notes = (payment.notes as Record<string, string>) || {};
    const donorName = name?.trim() || notes.name || "Donor";
    const donorEmail = email?.trim()?.toLowerCase() || notes.email;
    const receiptNumber = receipt || generateReceiptNumber();

    const donation = await Donation.create({
      donorName,
      email: donorEmail || undefined,
      amount: amountInr,
      paymentId,
      receiptNumber,
    });

    if (donorEmail) {
      sendDonationConfirmation(
        donorEmail,
        donorName,
        amountInr,
        receiptNumber
      ).catch(() => {});
    }

    return successResponse(
      {
        receiptNumber: donation.receiptNumber ?? receiptNumber,
        amount: donation.amount,
        name: donation.donorName,
        id: String(donation._id),
      },
      200,
      "Payment verified successfully"
    );
  } catch (err) {
    console.error("Payment verify error:", err);
    return errorResponse("Payment verification failed", 500, "INTERNAL_ERROR");
  }
}
