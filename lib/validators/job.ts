import { z } from "zod";
import { JobType } from "@prisma/client";

export const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters."),
  description: z.string().min(10, "Job description must be at least 10 characters."),
  jobType: z.nativeEnum(JobType),
  departmentId: z.string().min(1, "Department is required."),
  locationId: z.string().min(1, "Location is required."),
  isPublished: z.boolean().default(true),
});

export type JobInput = z.infer<typeof jobSchema>;
