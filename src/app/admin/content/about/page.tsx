"use client";

import { useState, useEffect } from "react";
import { getAboutContent, updateAboutContent } from "@/services/api";
import type { AboutContentData } from "@/services/api";
import { Toast } from "@/components/ui/Toast";
import { aboutSchema } from "@/lib/validations/content";

const DEFAULT_ABOUT: AboutContentData = {
  aboutText:
    "Kanhaiya Lal Shakya Social Welfare Society was established in 2015 as a registered non-profit organization under the Societies Registration Act, 1860.",
  visionText: "To build an equitable society where every individual has access to education, healthcare, and opportunities for sustainable livelihood.",
  missionText:
    "To implement evidence-based programs that empower underprivileged communities through education, healthcare delivery, environmental initiatives, and capacity-building.",
  objectives: [
    "Provide access to quality education for underprivileged children and youth.",
    "Conduct healthcare outreach programs in rural and underserved areas.",
    "Implement environmental conservation and afforestation initiatives.",
    "Support women empowerment through skill development and livelihood programs.",
    "Ensure transparent governance and compliance with regulatory requirements.",
  ],
};

const inputClass =
  "w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function AboutContentPage() {
  const [formData, setFormData] = useState<AboutContentData>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getAboutContent().then((res) => {
      if (res.success && res.data) {
        setFormData({
          aboutText: res.data.aboutText || DEFAULT_ABOUT.aboutText,
          visionText: res.data.visionText || DEFAULT_ABOUT.visionText,
          missionText: res.data.missionText || DEFAULT_ABOUT.missionText,
          objectives: res.data.objectives?.length ? res.data.objectives : DEFAULT_ABOUT.objectives,
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = aboutSchema.safeParse(formData);
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
    const res = await updateAboutContent(formData);
    if (res.success) {
      setToast({ type: "success", text: "About section updated successfully." });
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
        <h1 className="text-2xl font-serif font-semibold text-slate-800 mb-6">About Section</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-slate-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">About the Organization *</label>
            <textarea
              value={formData.aboutText}
              onChange={(e) => setFormData((p) => ({ ...p, aboutText: e.target.value }))}
              className={`${inputClass} min-h-[140px] ${errors.aboutText ? "border-red-500" : ""}`}
              maxLength={3000}
              rows={6}
              placeholder="Main about text. Use double line breaks for new paragraphs."
            />
            {errors.aboutText && <p className="mt-1 text-sm text-red-600">{errors.aboutText}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vision Statement</label>
            <textarea
              value={formData.visionText}
              onChange={(e) => setFormData((p) => ({ ...p, visionText: e.target.value }))}
              className={`${inputClass} min-h-[80px] ${errors.visionText ? "border-red-500" : ""}`}
              maxLength={1000}
              rows={3}
            />
            {errors.visionText && <p className="mt-1 text-sm text-red-600">{errors.visionText}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mission Statement</label>
            <textarea
              value={formData.missionText}
              onChange={(e) => setFormData((p) => ({ ...p, missionText: e.target.value }))}
              className={`${inputClass} min-h-[80px] ${errors.missionText ? "border-red-500" : ""}`}
              maxLength={1000}
              rows={3}
            />
            {errors.missionText && <p className="mt-1 text-sm text-red-600">{errors.missionText}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Core Objectives (one per line)</label>
            <textarea
              value={formData.objectives.join("\n")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  objectives: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                }))
              }
              className={`${inputClass} min-h-[160px] ${errors.objectives ? "border-red-500" : ""}`}
              rows={6}
              placeholder="Provide access to quality education..."
            />
            {errors.objectives && <p className="mt-1 text-sm text-red-600">{errors.objectives}</p>}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save About"}
          </button>
        </form>
      </div>
      {toast && <Toast message={toast.text} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}
