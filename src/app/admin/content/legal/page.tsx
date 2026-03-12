"use client";

import { useState, useEffect } from "react";
import { getLegalInfo, updateLegalInfo } from "@/services/api";
import type { LegalInfoData } from "@/services/api";
import { Toast } from "@/components/ui/Toast";
import { legalSchema } from "@/lib/validations/content";

const DEFAULT_LEGAL: LegalInfoData = {
  registrationNumber: "REG/2015/XXXX",
  registeredUnder: "Societies Registration Act, 1860",
  is80GCompliant: true,
  is12ACompliant: true,
  status: "Registered NGO",
};

const inputClass =
  "w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function LegalContentPage() {
  const [formData, setFormData] = useState<LegalInfoData>(DEFAULT_LEGAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getLegalInfo().then((res) => {
      if (res.success && res.data) {
        setFormData({
          registrationNumber: res.data.registrationNumber || DEFAULT_LEGAL.registrationNumber,
          registeredUnder: res.data.registeredUnder || DEFAULT_LEGAL.registeredUnder,
          is80GCompliant: res.data.is80GCompliant ?? DEFAULT_LEGAL.is80GCompliant,
          is12ACompliant: res.data.is12ACompliant ?? DEFAULT_LEGAL.is12ACompliant,
          status: res.data.status || DEFAULT_LEGAL.status,
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = legalSchema.safeParse(formData);
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
    const res = await updateLegalInfo(formData);
    if (res.success) {
      setToast({ type: "success", text: "Legal information updated successfully." });
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
        <h1 className="text-2xl font-serif font-semibold text-slate-800 mb-6">Legal Information</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-slate-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
              className={`${inputClass} ${errors.status ? "border-red-500" : ""}`}
              placeholder="e.g. Registered NGO"
            />
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData((p) => ({ ...p, registrationNumber: e.target.value }))}
              className={inputClass}
              placeholder="e.g. REG/2015/XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registered Under</label>
            <input
              type="text"
              value={formData.registeredUnder}
              onChange={(e) => setFormData((p) => ({ ...p, registeredUnder: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Societies Registration Act, 1860"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is80GCompliant}
                onChange={(e) => setFormData((p) => ({ ...p, is80GCompliant: e.target.checked }))}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-slate-700">80G Compliant</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is12ACompliant}
                onChange={(e) => setFormData((p) => ({ ...p, is12ACompliant: e.target.checked }))}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-slate-700">12A Compliant</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Legal Info"}
          </button>
        </form>
      </div>
      {toast && <Toast message={toast.text} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}
