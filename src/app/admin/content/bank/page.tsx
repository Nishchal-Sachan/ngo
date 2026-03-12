"use client";

import { useState, useEffect } from "react";
import { getBankDetails, updateBankDetails } from "@/services/api";
import type { BankDetailsData } from "@/services/api";
import { Toast } from "@/components/ui/Toast";
import { bankSchema } from "@/lib/validations/content";

const DEFAULT_BANK: BankDetailsData = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  ifsc: "",
  branch: "",
  contactEmail: "",
};

const inputClass =
  "w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function BankContentPage() {
  const [formData, setFormData] = useState<BankDetailsData>(DEFAULT_BANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getBankDetails().then((res) => {
      if (res.success && res.data) {
        setFormData({
          bankName: res.data.bankName || DEFAULT_BANK.bankName,
          accountName: res.data.accountName || DEFAULT_BANK.accountName,
          accountNumber: res.data.accountNumber || DEFAULT_BANK.accountNumber,
          ifsc: res.data.ifsc || DEFAULT_BANK.ifsc,
          branch: res.data.branch || DEFAULT_BANK.branch,
          contactEmail: res.data.contactEmail || DEFAULT_BANK.contactEmail,
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = bankSchema.safeParse(formData);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (path && !errs[path]) errs[path] = err.message;
      });
      setErrors(errs);
      return;
    }

    setSaving(true);
    const res = await updateBankDetails(formData);
    if (res.success) {
      setToast({ type: "success", text: "Bank details updated successfully." });
    } else {
      setToast({ type: "error", text: "error" in res ? res.error : "Update failed" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-serif font-semibold text-slate-800 mb-6">Bank Details</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-slate-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData((p) => ({ ...p, bankName: e.target.value }))}
              className={`${inputClass} ${errors.bankName ? "border-red-500" : ""}`}
              placeholder="e.g. State Bank of India"
            />
            {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData((p) => ({ ...p, accountName: e.target.value }))}
              className={`${inputClass} ${errors.accountName ? "border-red-500" : ""}`}
              placeholder="e.g. Organization Name"
            />
            {errors.accountName && <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData((p) => ({ ...p, accountNumber: e.target.value }))}
              className={`${inputClass} ${errors.accountNumber ? "border-red-500" : ""}`}
              placeholder="e.g. XXXXXXXXXXXX"
            />
            {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
            <input
              type="text"
              value={formData.ifsc}
              onChange={(e) => setFormData((p) => ({ ...p, ifsc: e.target.value }))}
              className={`${inputClass} ${errors.ifsc ? "border-red-500" : ""}`}
              placeholder="e.g. SBIN000XXXX"
            />
            {errors.ifsc && <p className="mt-1 text-sm text-red-600">{errors.ifsc}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData((p) => ({ ...p, branch: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Main Branch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))}
              className={`${inputClass} ${errors.contactEmail ? "border-red-500" : ""}`}
              placeholder="e.g. donations@example.org"
            />
            {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Bank Details"}
          </button>
        </form>
      </div>
      {toast && <Toast message={toast.text} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}
