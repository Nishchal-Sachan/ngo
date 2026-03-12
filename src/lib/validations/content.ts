import { z } from "zod";

export const heroSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  subtitle: z.string().max(300, "Subtitle cannot exceed 300 characters").optional().default(""),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional().default(""),
  imageUrl: z.string().optional().default(""),
  ctaPrimaryText: z.string().max(50, "CTA text cannot exceed 50 characters").optional().default("Donate"),
  ctaSecondaryText: z.string().max(50, "CTA text cannot exceed 50 characters").optional().default("Volunteer"),
});

export const aboutSchema = z.object({
  aboutText: z.string().min(1, "About text is required").max(3000, "About text cannot exceed 3000 characters"),
  visionText: z.string().max(1000, "Vision cannot exceed 1000 characters").optional().default(""),
  missionText: z.string().max(1000, "Mission cannot exceed 1000 characters").optional().default(""),
  objectives: z.array(z.string().min(1)).max(20, "Maximum 20 objectives").optional().default([]),
});

export const legalSchema = z.object({
  status: z.string().min(1, "Status is required").max(100, "Status cannot exceed 100 characters"),
  registrationNumber: z.string().max(100, "Registration number cannot exceed 100 characters").optional().default(""),
  registeredUnder: z.string().max(200, "Registered under cannot exceed 200 characters").optional().default(""),
  is80GCompliant: z.boolean().optional().default(false),
  is12ACompliant: z.boolean().optional().default(false),
});

export const bankSchema = z.object({
  bankName: z.string().max(150, "Bank name cannot exceed 150 characters").optional().default(""),
  accountName: z.string().max(150, "Account name cannot exceed 150 characters").optional().default(""),
  accountNumber: z.string().max(50, "Account number cannot exceed 50 characters").optional().default(""),
  ifsc: z.string().max(20, "IFSC cannot exceed 20 characters").optional().default(""),
  branch: z.string().max(150, "Branch cannot exceed 150 characters").optional().default(""),
  contactEmail: z.union([z.string().email("Invalid email").max(150), z.literal("")]).optional().default(""),
});

export const boardMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  designation: z.string().min(1, "Designation is required").max(100, "Designation cannot exceed 100 characters"),
  order: z.number().int().min(0, "Order must be non-negative").optional().default(0),
});

export type HeroInput = z.infer<typeof heroSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;
export type LegalInput = z.infer<typeof legalSchema>;
export type BankInput = z.infer<typeof bankSchema>;
export type BoardMemberInput = z.infer<typeof boardMemberSchema>;
