import { z } from "zod";

export const brandThemeSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  tagline: z.string().optional().nullable(),
  aboutText: z.string().optional().nullable(),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color."),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color."),
  fontFamily: z.enum(["Inter", "Roboto", "Outfit", "Poppins", "Geist"]),
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
  bannerUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
});

export type BrandThemeInput = z.infer<typeof brandThemeSchema>;
