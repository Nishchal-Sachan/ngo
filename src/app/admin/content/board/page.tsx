"use client";

import { useState, useEffect } from "react";
import {
  getBoardMembers,
  createBoardMember,
  updateBoardMember,
  deleteBoardMember,
  type BoardMemberItem,
} from "@/services/api";
import { Toast } from "@/components/ui/Toast";
import { boardMemberSchema } from "@/lib/validations/content";

const inputClass =
  "w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function BoardContentPage() {
  const [members, setMembers] = useState<BoardMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", designation: "", order: 0 });
  const [editData, setEditData] = useState<Record<string, { name: string; designation: string; order: number }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadMembers = async () => {
    const res = await getBoardMembers();
    if (res.success && res.data) setMembers(res.data);
  };

  useEffect(() => {
    loadMembers().then(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = boardMemberSchema.safeParse({
      name: formData.name.trim(),
      designation: formData.designation.trim(),
      order: formData.order,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (path && !errs[path]) errs[path] = err.message;
      });
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    const res = await createBoardMember({
      name: formData.name.trim(),
      designation: formData.designation.trim(),
      order: formData.order,
    });
    if (res.success) {
      setToast({ type: "success", text: "Board member added." });
      setShowForm(false);
      setFormData({ name: "", designation: "", order: members.length });
      await loadMembers();
    } else {
      setToast({ type: "error", text: "error" in res ? res.error : "Failed to add member" });
    }
    setSubmitting(false);
  };

  const handleEdit = (m: BoardMemberItem) => {
    setEditingId(m.id);
    setEditData({
      [m.id]: { name: m.name, designation: m.designation, order: m.order },
    });
  };

  const handleSaveEdit = async (id: string) => {
    const data = editData[id];
    if (!data) return;

    const parsed = boardMemberSchema.safeParse(data);
    if (!parsed.success) {
      setToast({ type: "error", text: parsed.error.issues[0]?.message ?? "Validation failed" });
      return;
    }

    setSubmitting(true);
    const res = await updateBoardMember(id, data);
    if (res.success) {
      setToast({ type: "success", text: "Board member updated." });
      setEditingId(null);
      setEditData({});
      await loadMembers();
    } else {
      setToast({ type: "error", text: "error" in res ? res.error : "Failed to update" });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    const res = await deleteBoardMember(id);
    if (res.success) {
      setToast({ type: "success", text: "Board member deleted." });
      setDeleteConfirmId(null);
      await loadMembers();
    } else {
      setToast({ type: "error", text: "error" in res ? res.error : "Failed to delete" });
    }
    setSubmitting(false);
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
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-serif font-semibold text-slate-800">Board Members</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ name: "", designation: "", order: members.length });
              setErrors({});
            }}
            className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark"
          >
            {showForm ? "Cancel" : "Add Member"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-lg border border-slate-200 p-6 mb-8"
          >
            <h2 className="text-lg font-serif font-semibold text-slate-800 mb-4">Add Member</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))}
                  className={`${inputClass} ${errors.designation ? "border-red-500" : ""}`}
                  placeholder="e.g. President"
                />
                {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Member"}
            </button>
          </form>
        )}

        {members.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
            No board members yet. Add one to get started.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 w-16">Order</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Designation</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">
                      {editingId === m.id ? (
                        <input
                          type="number"
                          min={0}
                          value={editData[m.id]?.order ?? m.order}
                          onChange={(e) =>
                            setEditData((p) => ({
                              ...p,
                              [m.id]: {
                                ...(p[m.id] ?? { name: m.name, designation: m.designation, order: m.order }),
                                order: parseInt(e.target.value, 10) || 0,
                              },
                            }))
                          }
                          className={`${inputClass} w-20`}
                        />
                      ) : (
                        <span className="text-slate-600">{m.order}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === m.id ? (
                        <input
                          type="text"
                          value={editData[m.id]?.name ?? m.name}
                          onChange={(e) =>
                            setEditData((p) => ({
                              ...p,
                              [m.id]: {
                                ...(p[m.id] ?? { name: m.name, designation: m.designation, order: m.order }),
                                name: e.target.value,
                              },
                            }))
                          }
                          className={inputClass}
                        />
                      ) : (
                        <span className="font-medium text-slate-800">{m.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === m.id ? (
                        <input
                          type="text"
                          value={editData[m.id]?.designation ?? m.designation}
                          onChange={(e) =>
                            setEditData((p) => ({
                              ...p,
                              [m.id]: {
                                ...(p[m.id] ?? { name: m.name, designation: m.designation, order: m.order }),
                                designation: e.target.value,
                              },
                            }))
                          }
                          className={inputClass}
                        />
                      ) : (
                        <span className="text-slate-600">{m.designation}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === m.id ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSaveEdit(m.id)}
                            disabled={submitting}
                            className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditData({});
                            }}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : deleteConfirmId === m.id ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={submitting}
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(m)}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(m.id)}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.text} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}
