"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export interface RegisterInput {
  name: string;
  companyName: string;
  email: string;
  password: string;
}

export async function registerRecruiterAction(input: RegisterInput) {
  const { name, companyName, email, password } = input;

  if (!email || !password || !name || !companyName) {
    return { success: false, error: "All fields are required" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long" };
  }

  const existingUser = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingUser) {
    return { success: false, error: "An account with this email address already exists. Please log in." };
  }

  // Generate unique slug
  let baseSlug = companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) baseSlug = "company";

  let slug = baseSlug;
  let counter = 1;
  while (await db.company.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Create Company
      const company = await tx.company.create({
        data: {
          name: companyName.trim(),
          slug,
          primaryColor: "#005d52",
          secondaryColor: "#0f172a",
        },
      });

      // 2. Create User
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
          role: Role.RECRUITER,
          companyId: company.id,
        },
      });

      // 3. Create CareersPage record
      const careersPage = await tx.careersPage.create({
        data: {
          companyId: company.id,
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      // 4. Seed initial default sections
      await tx.pageSection.createMany({
        data: [
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "HERO",
            title: `Join ${companyName}`,
            orderIndex: 0,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: "hero-split",
              showInNav: true,
              elements: [
                { id: "h1", type: "heading", content: { text: `Build Your Career at ${companyName}` }, alignment: "left" },
                { id: "t1", type: "text", content: { text: "We are on a mission to build extraordinary products with an ambitious team." }, alignment: "left" },
                { id: "b1", type: "button", content: { text: "Explore Open Roles", url: "#jobs-section" }, alignment: "left" },
              ],
            },
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "OPEN_ROLES",
            title: "Current Openings",
            orderIndex: 1,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: "jobs-grid-cards",
              showInNav: true,
              elements: [
                { id: "h2", type: "heading", content: { text: "Open Requisitions" }, alignment: "center" },
              ],
            },
          },
        ],
      });

      return { user, company };
    });

    return { success: true, companySlug: result.company.slug, email: result.user.email };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create account" };
  }
}
