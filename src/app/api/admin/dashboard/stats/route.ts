import { successResponse, errorResponse } from "@/lib/api-response";
import connectDB from "@/lib/db";
import Donation from "@/models/Donation";
import Volunteer from "@/models/Volunteer";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await connectDB();
    const [donationAgg, totalVolunteers, activeCampaigns, donationsByMonth] =
      await Promise.all([
        Donation.aggregate([
          { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
        ]).then((r) => r[0] ?? { totalAmount: 0, count: 0 }),
        Volunteer.countDocuments(),
        Campaign.countDocuments({ isActive: true }),
        Donation.find({}, { amount: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(500),
      ]);

    const totalDonations = Number(donationAgg?.totalAmount ?? 0);
    const donationCount = donationAgg?.count ?? 0;

    const monthMap = new Map<string, { amount: number; count: number }>();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (const d of donationsByMonth) {
      const dt = d.createdAt;
      const key = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
      const existing = monthMap.get(key) ?? { amount: 0, count: 0 };
      existing.amount += d.amount;
      existing.count += 1;
      monthMap.set(key, existing);
    }
    const monthlyDonations = Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([key, v]) => {
        const [y, m] = key.split("-").map(Number);
        return { month: `${monthNames[m - 1]} ${y}`, amount: v.amount, count: v.count };
      });

    return successResponse({
      totalDonations,
      donationCount,
      totalVolunteers,
      activeCampaigns,
      monthlyDonations,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return errorResponse("Failed to fetch dashboard stats", 500, "INTERNAL_ERROR");
  }
}
