"use client";

import { useState, useEffect } from "react";
import {
  getAdminReports,
  uploadReport,
  createReport,
  deleteReport,
} from "@/services/api";

interface ReportItem {
  id: string;
  title: string;
  year: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear().toString(),
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    url: string;
    publicId: string;
    fileName: string;
    fileSize: number;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await getAdminReports();
      if (res.success && res.data) setReports(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    setUploading(true);
    setError("");
    setUploadResult(null);
    const res = await uploadReport(file);
    if (res.success && res.data) {
      setUploadResult(res.data);
    } else {
      setError("error" in res ? res.error : "Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadResult) {
      setError("Please upload a PDF file first");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await createReport({
      title: formData.title.trim(),
      year: parseInt(formData.year, 10),
      fileUrl: uploadResult.url,
      fileName: uploadResult.fileName,
      fileSize: uploadResult.fileSize,
      publicId: uploadResult.publicId,
    });
    if (res.success) {
      setShowForm(false);
      setFormData({ title: "", year: new Date().getFullYear().toString() });
      setUploadResult(null);
      const refresh = await getAdminReports();
      if (refresh.success && refresh.data) setReports(refresh.data);
    } else {
      setError("error" in res ? res.error : "Failed to save report");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    const res = await deleteReport(id);
    if (res.success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    } else {
      setError("error" in res ? res.error : "Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-serif font-semibold text-slate-800">Annual Reports</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setUploadResult(null);
            }}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "Upload Report"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-md border border-slate-200 p-6 mb-8"
          >
            <h2 className="text-lg font-serif font-semibold text-slate-800 mb-4">
              Upload PDF Report
            </h2>
            <div className="space-y-4">
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
                  placeholder="e.g. Annual Report 2024"
                  required
                  className="w-full px-3 py-2 rounded-md border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, year: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 rounded-md border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  PDF File *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="w-full text-sm"
                />
                {uploading && (
                  <p className="text-sm text-slate-500 mt-1">Uploading...</p>
                )}
                {uploadResult && (
                  <p className="text-sm text-emerald-600 mt-1">
                    ✓ {uploadResult.fileName} ({formatFileSize(uploadResult.fileSize)})
                  </p>
                )}
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !uploadResult}
              className="mt-4 px-4 py-2 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Report"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-slate-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-md border border-slate-200 p-12 text-center text-slate-500">
            No reports yet. Upload your first annual report.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-md border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800">{r.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {r.year} • {formatFileSize(r.fileSize)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md border border-slate-200 text-sm font-medium hover:bg-slate-50"
                  >
                    View
                  </a>
                  <a
                    href={r.fileUrl}
                    download={r.fileName}
                    className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-4 py-2 rounded-md border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
