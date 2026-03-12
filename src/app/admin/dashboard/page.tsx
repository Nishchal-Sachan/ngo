"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getDashboardStats,
  getDonations,
  getVolunteers,
} from "@/services/api";

interface Stats {
  totalDonations: number;
  donationCount: number;
  totalVolunteers: number;
  activeCampaigns: number;
  monthlyDonations: { month: string; amount: number; count: number }[];
}

interface Donation {
  id: string;
  name: string;
  amount: number;
  receiptNumber: string;
  createdAt: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  occupation: string;
  city: string;
  createdAt: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [donationPage, setDonationPage] = useState(1);
  const [volunteerPage, setVolunteerPage] = useState(1);
  const [donationTotal, setDonationTotal] = useState(0);
  const [volunteerTotal, setVolunteerTotal] = useState(0);
  const [donationSearch, setDonationSearch] = useState("");
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 5;

  useEffect(() => {
    async function loadStats() {
      const res = await getDashboardStats();
      if (res.success && res.data) setStats(res.data);
    }
    loadStats();
  }, []);

  useEffect(() => {
    async function loadDonations() {
      const res = await getDonations({
        page: donationPage,
        limit,
        search: donationSearch || undefined,
      });
      if (res.success && res.data) {
        setDonations(res.data.data as Donation[]);
        setDonationTotal(res.data.pagination.total);
      }
    }
    loadDonations();
  }, [donationPage, donationSearch]);

  useEffect(() => {
    async function loadVolunteers() {
      const res = await getVolunteers({
        page: volunteerPage,
        limit,
        search: volunteerSearch || undefined,
      });
      if (res.success && res.data) {
        setVolunteers(res.data.data as Volunteer[]);
        setVolunteerTotal(res.data.pagination?.total ?? 0);
      }
    }
    loadVolunteers();
  }, [volunteerPage, volunteerSearch]);

  useEffect(() => {
    setLoading(!stats);
  }, [stats]);

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const donationTotalPages = Math.ceil(donationTotal / limit);
  const volunteerTotalPages = Math.ceil(volunteerTotal / limit);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-serif font-semibold text-slate-800 mb-8">Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-md border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Total Donations
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {stats ? formatCurrency(stats.totalDonations) : "—"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {stats?.donationCount ?? 0} transactions
            </p>
          </div>
          <div className="bg-white rounded-md border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Volunteers
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-600">
              {stats?.totalVolunteers ?? 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">Registered</p>
          </div>
          <div className="bg-white rounded-md border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Active Campaigns
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {stats?.activeCampaigns ?? 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">Running</p>
          </div>
          <div className="bg-white rounded-md border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Donation Count
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-700">
              {stats?.donationCount ?? 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">Total contributions</p>
          </div>
        </div>

        {/* Monthly donation graph */}
        <div className="bg-white rounded-md border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Monthly Donations
          </h2>
          <div className="h-64 sm:h-80">
            {stats?.monthlyDonations && stats.monthlyDonations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.monthlyDonations}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#64748b"
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
                    tick={{ fontSize: 12 }}
                    stroke="#64748b"
                  />
                  <Tooltip
                    formatter={(value: number | undefined) =>
                      value != null ? [formatCurrency(value), "Amount"] : ["—", "Amount"]
                    }
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Amount"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No donation data yet
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent donations table */}
          <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-serif font-semibold text-slate-800">
                Recent Donations
              </h2>
              <input
                type="search"
                placeholder="Search by name..."
                value={donationSearch}
                onChange={(e) => {
                  setDonationSearch(e.target.value);
                  setDonationPage(1);
                }}
                className="px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Donor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">
                      Receipt
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {d.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-600 font-medium">
                        {formatCurrency(d.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell font-mono">
                        {d.receiptNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(d.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {donations.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-sm">
                No donations found
              </div>
            )}
            {donationTotalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Page {donationPage} of {donationTotalPages} ({donationTotal}{" "}
                  total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDonationPage((p) => Math.max(1, p - 1))}
                    disabled={donationPage <= 1}
                    className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setDonationPage((p) =>
                        Math.min(donationTotalPages, p + 1)
                      )
                    }
                    disabled={donationPage >= donationTotalPages}
                    className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Volunteers table */}
          <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-serif font-semibold text-slate-800">
                Volunteers
              </h2>
              <input
                type="search"
                placeholder="Search by name or email..."
                value={volunteerSearch}
                onChange={(e) => {
                  setVolunteerSearch(e.target.value);
                  setVolunteerPage(1);
                }}
                className="px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Occupation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      City
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {volunteers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {v.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">
                        {v.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                        {v.occupation}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {v.city}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {volunteers.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-sm">
                No volunteers found
              </div>
            )}
            {volunteerTotalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Page {volunteerPage} of {volunteerTotalPages} ({volunteerTotal}{" "}
                  total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setVolunteerPage((p) => Math.max(1, p - 1))
                    }
                    disabled={volunteerPage <= 1}
                    className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setVolunteerPage((p) =>
                        Math.min(volunteerTotalPages, p + 1)
                      )
                    }
                    disabled={volunteerPage >= volunteerTotalPages}
                    className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
