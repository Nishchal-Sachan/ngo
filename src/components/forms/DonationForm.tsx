"use client";

import { useState, useCallback } from "react";
import Script from "next/script";
import type { DonationFormData } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createPaymentOrder, verifyPayment } from "@/services/api";

const SUGGESTED_AMOUNTS = [500, 1000, 2500, 5000];

const inputClassName =
  "px-4 py-3 rounded-md border border-slate-200 bg-white text-ink placeholder:text-muted w-full focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all duration-200";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  description?: string;
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss: () => void };
  prefill?: { name?: string; contact?: string };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayResponse) => void) => void;
}

export function DonationForm() {
  const [formData, setFormData] = useState<Partial<DonationFormData>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) || 0 : value,
    }));
  }, []);

  const setAmount = useCallback((amount: number) => {
    setFormData((prev) => ({ ...prev, amount }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const name = formData.name?.trim();
    const email = formData.email?.trim();
    const phone = String(formData.phone || "").replace(/\D/g, "").slice(-10);
    const amount = Number(formData.amount) || 0;
    const pan = String(formData.pan || "").trim().toUpperCase();

    if (!name || name.length < 2) {
      setStatus("error");
      setMessage("Please enter your name");
      return;
    }
    if (phone.length !== 10) {
      setStatus("error");
      setMessage("Please enter a valid 10-digit phone number");
      return;
    }
    if (amount < 1) {
      setStatus("error");
      setMessage("Please enter a valid amount (minimum 1 INR)");
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      setStatus("error");
      setMessage("Please enter a valid PAN (e.g., ABCDE1234F)");
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      setStatus("error");
      setMessage("Payment system is loading. Please try again in a moment.");
      return;
    }

    const orderRes = await createPaymentOrder({ name, email, phone, amount, pan });

    if (!orderRes.success || !orderRes.data) {
      setStatus("error");
      setMessage("error" in orderRes ? orderRes.error : "Failed to create payment order");
      return;
    }

    const { orderId, amount: orderAmount, currency, keyId, receipt } = orderRes.data;

    const options: RazorpayOptions = {
      key: keyId,
      amount: orderAmount,
      currency,
      name: "Kanhaiya lal Shakya Social Welfare Society",
      order_id: orderId,
      description: "Donation",
      prefill: { name, contact: phone },
      handler: async (response: RazorpayResponse) => {
        setStatus("loading");
        setMessage("Verifying your payment...");

        const verifyRes = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          receipt,
          name,
          email,
          phone,
          pan,
        });

        if (verifyRes.success && verifyRes.data) {
          const params = new URLSearchParams({
            receipt: verifyRes.data.receiptNumber,
            amount: String(verifyRes.data.amount),
            name: verifyRes.data.name,
          });
          window.location.href = `/donate/success?${params.toString()}`;
          return;
        }

        const errMsg = "error" in verifyRes ? verifyRes.error : "Payment verification failed";
        const failureParams = new URLSearchParams({ reason: errMsg });
        window.location.href = `/donate/failure?${failureParams.toString()}`;
      },
      modal: {
        ondismiss: () => {
          setStatus("idle");
          setMessage("");
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      setStatus("idle");
      setMessage("");
    } catch (err) {
      console.error("Razorpay open error:", err);
      setStatus("error");
      setMessage("Failed to open payment window");
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Suggested donation amounts */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Choose an amount
          </label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
                  formData.amount === amt
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-muted hover:bg-primary/10 hover:text-primary"
                }`}
              >
                ₹{amt.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>

        <Input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email (for 80G receipt)"
          value={formData.email ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <Input
          type="tel"
          name="phone"
          placeholder="Phone (10 digits)"
          value={formData.phone ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <Input
          type="number"
          name="amount"
          placeholder="Or enter custom amount (INR)"
          min={1}
          value={formData.amount ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <Input
          type="text"
          name="pan"
          placeholder="PAN (required for 80G receipt)"
          value={formData.pan ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        {message && (
          <p
            className={`text-sm font-medium ${
              status === "error" ? "text-red-600" : "text-primary"
            }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            {status === "loading" ? "Processing..." : "Proceed to Payment"}
          </Button>
          <p className="text-xs text-muted text-center">
            Payments processed securely. PCI-DSS compliant.
          </p>
        </div>
      </form>
    </>
  );
}
