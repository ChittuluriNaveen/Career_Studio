import { z } from "zod";
import { EmploymentType, WorkMode, JobStatus } from "@prisma/client";

export const jobSchema = z
  .object({
    title: z.string().min(3, "Job title must be at least 3 characters.").max(120),
    departmentName: z.string().min(2, "Department name is required."),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
    workMode: z.enum(["ON_SITE", "HYBRID", "REMOTE"]),
    locationCity: z.string().min(2, "City is required."),
    locationCountry: z.string().min(2, "Country is required."),
    salaryMin: z
      .union([z.number(), z.string()])
      .optional()
      .nullable()
      .transform((val) => (val === "" || val === null || val === undefined ? null : Number(val))),
    salaryMax: z
      .union([z.number(), z.string()])
      .optional()
      .nullable()
      .transform((val) => (val === "" || val === null || val === undefined ? null : Number(val))),
    currency: z
      .string()
      .length(3, "Currency code must be exactly 3 uppercase letters (e.g. USD, INR, EUR).")
      .transform((c) => c.toUpperCase())
      .optional()
      .nullable(),
    salaryVisible: z.boolean().default(false),
    summary: z.string().min(10, "Summary overview must be at least 10 characters."),
    responsibilities: z
      .array(z.string().min(1, "Responsibility item cannot be empty"))
      .min(1, "At least one responsibility is required."),
    requirements: z
      .array(z.string().min(1, "Requirement item cannot be empty"))
      .min(1, "At least one requirement is required."),
    preferredSkills: z.array(z.string()).default([]),
    benefits: z.array(z.string()).default([]),
    expiryDate: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? new Date(val) : null)),
    status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  })
  .refine(
    (data) => {
      if (data.salaryMin !== null && data.salaryMax !== null) {
        return data.salaryMin <= data.salaryMax;
      }
      return true;
    },
    {
      message: "Minimum salary cannot be greater than maximum salary.",
      path: ["salaryMax"],
    }
  );

export type JobInput = z.infer<typeof jobSchema>;

export const applicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required."),
  companyId: z.string().min(1, "Company ID is required."),
  candidateName: z.string().min(2, "Candidate name must be at least 2 characters."),
  candidateEmail: z.string().email("Invalid candidate email address."),
  resumeUrl: z.string().url("Valid resume URL is required.").optional().or(z.literal("")),
  coverLetter: z.string().optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
