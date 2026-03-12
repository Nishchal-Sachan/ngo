"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCampaign,
  updateCampaign,
  deleteCampaign,
  uploadImage,
} from "@/services/api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    raisedAmount: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await getCampaign(id);
      if (res.success && res.data) {
        const d = res.data;
        setFormData({
          title: d.title,
          description: d.description,
          goalAmount: String(d.goalAmount),
          raisedAmount: String(d.raisedAmount),
          startDate: d.startDate
            ? new Date(d.startDate).toISOString().slice(0, 10)
            : "",
          endDate: d.endDate
            ? new Date(d.endDate).toISOString().slice(0, 10)
            : "",
          imageUrl: d.imageUrl || "",
          status: d.status,
        });
      } else {
        setError("Campaign not found");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const res = await uploadImage(file);
    if (res.success && res.data) {
      setFormData((p) => ({ ...p, imageUrl: res.data!.url }));
    } else {
      setError("error" in res ? res.error : "Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await updateCampaign(id, {
      title: formData.title,
      description: formData.description,
      goalAmount: Number(formData.goalAmount) || 0,
      raisedAmount: Number(formData.raisedAmount) || 0,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      imageUrl: formData.imageUrl || undefined,
      status: formData.status,
    });
    if (res.success) {
      router.push("/admin/campaigns");
      router.refresh();
    } else {
      setError("error" in res ? res.error : "Failed to update");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    setDeleting(true);
    const res = await deleteCampaign(id);
    if (res.success) {
      router.push("/admin/campaigns");
      router.refresh();
    } else {
      setError("error" in res ? res.error : "Failed to delete");
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-800"
          >
            ← Back
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md border border-slate-200 p-6"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Campaign</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                required
                className="w-full px-3 py-2 rounded-md border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                required
                rows={5}
                className="w-full px-3 py-2 rounded-md border border-slate-200"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Goal Amount (INR) *
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.goalAmount}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, goalAmount: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 rounded-md border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Raised Amount (INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.raisedAmount}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, raisedAmount: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-md border border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, startDate: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 rounded-md border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, endDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-md border border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="w-full text-sm"
              />
              {uploading && (
                <p className="text-sm text-slate-500 mt-1">Uploading...</p>
              )}
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-2 h-32 object-cover rounded-lg"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-md border border-slate-200"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Active campaigns are visible on the public site.
              </p>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
