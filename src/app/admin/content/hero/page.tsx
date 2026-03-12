"use client";

import { useState, useEffect } from "react";
import { getHeroContent, updateHeroContent } from "@/services/api";
import type { HeroContent } from "@/services/api";
import { Toast } from "@/components/ui/Toast";
import { heroSchema, type HeroInput } from "@/lib/validations/content";

const DEFAULT_HERO: HeroContent = {
  title: "Kanhaiya Lal Shakya Social Welfare Society",
  subtitle: "Empowering Communities Through Sustainable Development Since 2015.",
  description:
    "We are a registered non-profit dedicated to uplifting underprivileged communities through education, healthcare, environmental initiatives, and women empowerment.",
  imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80",
  ctaPrimaryText: "Donate",
  ctaSecondaryText: "Volunteer",
};

const inputClass =
  "w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function HeroContentPage() {
  const [formData, setFormData] = useState<HeroContent>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getHeroContent().then((res) => {
      if (res.success && res.data) {
        setFormData({
          title: res.data.title || DEFAULT_HERO.title,
          subtitle: res.data.subtitle || DEFAULT_HERO.subtitle,
          description: res.data.description || DEFAULT_HERO.description,
          imageUrl: res.data.imageUrl || DEFAULT_HERO.imageUrl,
          ctaPrimaryText: res.data.ctaPrimaryText || DEFAULT_HERO.ctaPrimaryText,
          ctaSecondaryText: res.data.ctaSecondaryText || DEFAULT_HERO.ctaSecondaryText,
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = heroSchema.safeParse(formData);
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
    const res = await updateHeroContent({
      ...formData,
      image: imageFile ?? undefined,
    });

    if (res.success) {
      setToast({ type: "success", text: "Hero section updated successfully." });
      if (res.data?.imageUrl) setFormData((p) => ({ ...p, imageUrl: res.data!.imageUrl }));
      setImageFile(null);
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
        <h1 className="text-2xl font-serif font-semibold text-slate-800 mb-6">Hero Section</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-slate-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className={`${inputClass} ${errors.title ? "border-red-500" : ""}`}
              maxLength={200}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
              className={`${inputClass} ${errors.subtitle ? "border-red-500" : ""}`}
              maxLength={300}
            />
            {errors.subtitle && <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className={`${inputClass} min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
              maxLength={1000}
              rows={5}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Background Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">Upload new image or leave blank to keep current. Max 5MB.</p>
            {formData.imageUrl && !imageFile && (
              <img
                src={formData.imageUrl}
                alt="Current hero"
                className="mt-2 h-32 object-cover rounded-md border border-slate-200"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary CTA Text</label>
              <input
                type="text"
                value={formData.ctaPrimaryText}
                onChange={(e) => setFormData((p) => ({ ...p, ctaPrimaryText: e.target.value }))}
                className={inputClass}
                maxLength={50}
                placeholder="Donate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Secondary CTA Text</label>
              <input
                type="text"
                value={formData.ctaSecondaryText}
                onChange={(e) => setFormData((p) => ({ ...p, ctaSecondaryText: e.target.value }))}
                className={inputClass}
                maxLength={50}
                placeholder="Volunteer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Hero"}
          </button>
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
