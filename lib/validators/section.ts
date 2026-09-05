import { z } from "zod";
import { SectionType } from "@prisma/client";

export const createSectionSchema = z.object({
  type: z.nativeEnum(SectionType),
  title: z.string().min(1, "Section title is required."),
  content: z.record(z.string(), z.any()),
  layoutVariant: z.string().optional().default("01"),
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
  layoutVariant: z.string().optional(),
  enabled: z.boolean().optional(),
});

export const toggleSectionVisibilitySchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
});

export type CreateSectionInput = z.input<typeof createSectionSchema>;
export type UpdateSectionOrderInput = z.infer<typeof updateSectionOrderSchema>;
export type UpdateSectionContentInput = z.infer<typeof updateSectionContentSchema>;
export type ToggleSectionVisibilityInput = z.infer<typeof toggleSectionVisibilitySchema>;
