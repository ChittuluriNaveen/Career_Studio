import { z } from "zod";
import { SectionType } from "@prisma/client";

export const createSectionSchema = z.object({
  type: z.nativeEnum(SectionType),
  title: z.string().min(1, "Section title is required."),
  content: z.record(z.string(), z.any()),
});

export const updateSectionOrderSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      orderIndex: z.number().int(),
    })
  ),
});

export const updateSectionContentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.record(z.string(), z.any()),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionOrderInput = z.infer<typeof updateSectionOrderSchema>;
export type UpdateSectionContentInput = z.infer<typeof updateSectionContentSchema>;
