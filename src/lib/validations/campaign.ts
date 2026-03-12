import { z } from "zod";

const campaignStatusSchema = z.enum(["draft", "active", "completed", "cancelled"]);

export const createCampaignSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description cannot exceed 2000 characters"),
  goalAmount: z
    .number()
    .min(1, "Goal amount must be at least 1 INR")
    .max(100_000_000, "Goal amount cannot exceed 10 crore"),
  raisedAmount: z.number().min(0).optional().default(0),
  status: campaignStatusSchema.optional().default("draft"),
  startDate: z.union([z.string(), z.coerce.date()]).optional().nullable(),
  endDate: z.union([z.string(), z.coerce.date()]).optional().nullable(),
  imageUrl: z
    .union([
      z.string().url(),
      z.string().startsWith("/"),
      z.literal(""),
    ])
    .optional()
    .nullable(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
