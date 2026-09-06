import { db } from "../lib/db";

async function testInsert() {
  try {
    const company = await db.company.findFirst();
    if (!company) {
      console.log("No company found to test");
      return;
    }

    let careersPage = await db.careersPage.findUnique({
      where: { companyId: company.id },
    });

    if (!careersPage) {
      careersPage = await db.careersPage.create({
        data: { companyId: company.id },
      });
    }

    const testSection = await db.pageSection.create({
      data: {
        careersPageId: careersPage.id,
        companyId: company.id,
        type: "TECH_STACK",
        title: "Test Tech Stack",
        content: { items: [] },
        layoutVariant: "01",
        orderIndex: 999,
        enabled: true,
        isDraft: true,
        isPublished: false,
      },
    });

    console.log("SUCCESS! Created section:", testSection.id, testSection.type);

    // Cleanup test record
    await db.pageSection.delete({ where: { id: testSection.id } });
    console.log("Cleaned up test section successfully.");
  } catch (err: any) {
    console.error("Test Insert Error:", err);
  } finally {
    process.exit(0);
  }
}

testInsert();
