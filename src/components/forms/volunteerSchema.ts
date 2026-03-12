import { z } from "zod";

const OCCUPATIONS = [
  "student",
  "teacher",
  "doctor",
  "engineer",
  "business",
  "farmer",
  "homemaker",
  "retired",
  "other",
] as const;

export const volunteerFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  occupation: z
    .string()
    .min(1, "Please select an occupation")
    .refine((val) => OCCUPATIONS.includes(val as (typeof OCCUPATIONS)[number]), {
      message: "Please select a valid occupation",
    }),
  occupationOther: z.string().max(50).optional().or(z.literal("")),
  address: z
    .string()
    .min(1, "Address is required")
    .max(300, "Address cannot exceed 300 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City cannot exceed 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State cannot exceed 100 characters"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"),
  fatherName: z
    .string()
    .min(1, "Father's name is required")
    .max(100, "Father's name cannot exceed 100 characters"),
  qualification: z
    .string()
    .min(1, "Qualification is required")
    .max(100, "Qualification cannot exceed 100 characters"),
});

export type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;
