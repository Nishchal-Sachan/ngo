"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAdminCampaigns,
  createCampaign,
  uploadImage,
  type CampaignItem,
} from "@/services/api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    imageUrl: "",
    status: "draft",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function load() {
      const res = await getAdminCampaigns(
        statusFilter ? { status: statusFilter } : undefined
      );
      if (res.success && res.data) setCampaigns(res.data);
      setLoading(false);
    }
    load();
  }, [statusFilter]);

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
    setSubmitting(true);
    setError("");
    const res = await createCampaign({
      ...formData,
      goalAmount: Number(formData.goalAmount) || 0,
      endDate: formData.endDate || undefined,
      imageUrl: formData.imageUrl || undefined,
    });
    if (res.success) {
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        goalAmount: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: "",
        imageUrl: "",
        status: "draft",
      });
      const refresh = await getAdminCampaigns(
        statusFilter ? { status: statusFilter } : undefined
      );
      if (refresh.success && refresh.data) setCampaigns(refresh.data);
    } else {
      setError("error" in res ? res.error : "Failed to create campaign");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-serif font-semibold text-slate-800">Campaigns</h1>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-slate-200 text-sm"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700"
            >
              {showForm ? "Cancel" : "New Campaign"}
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-md border border-slate-200 p-6 mb-8"
          >
            <h2 className="text-lg font-serif font-semibold text-slate-800 mb-4">
              Create Campaign
            </h2>
            <div className="grid gap-4">
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Amount (INR) *
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
                    className="mt-2 h-32 object-cover rounded-md"
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
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 px-4 py-2 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-slate-500">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-md border border-slate-200 p-12 text-center text-slate-500">
            No campaigns found. Create one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-md border border-slate-200 p-6 flex flex-col sm:flex-row gap-4"
              >
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    className="w-full sm:w-40 h-32 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <h3 className="font-semibold text-slate-800">{c.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        c.status === "active"
                          ? "bg-emerald-100 text-emerald-600"
                          : c.status === "completed"
                            ? "bg-slate-100 text-slate-600"
                            : c.status === "cancelled"
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {c.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <span className="text-emerald-600 font-medium">
                      {formatCurrency(c.raisedAmount)} / {formatCurrency(c.goalAmount)}
                    </span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2">
                  <Link
                    href={`/admin/campaigns/${c.id}`}
                    className="px-4 py-2 rounded-md border border-slate-200 text-sm font-medium hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
