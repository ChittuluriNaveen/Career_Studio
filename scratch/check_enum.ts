import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://user@127.0.0.1:5433/whitecarrot_db?schema=public";
const pool = new Pool({ connectionString });

async function checkAndFixEnum() {
  try {
    const res = await pool.query(`
      SELECT enumlabel 
      FROM pg_enum 
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
      WHERE pg_type.typname = 'SectionType';
    `);

    const existingValues = res.rows.map((r) => r.enumlabel);
    console.log("Current SectionType enum values in PostgreSQL:", existingValues);

    const neededValues = ["PEOPLE", "DEPARTMENTS", "TECH_STACK", "PROCESS", "TESTIMONIALS"];
    for (const val of neededValues) {
      if (!existingValues.includes(val)) {
        console.log(`Adding missing enum value '${val}' to SectionType...`);
        try {
          await pool.query(`ALTER TYPE "SectionType" ADD VALUE '${val}';`);
          console.log(`Successfully added '${val}'`);
        } catch (err: any) {
          console.error(`Failed to add '${val}':`, err.message);
        }
      } else {
        console.log(`Enum value '${val}' already exists.`);
      }
    }
  } catch (error: any) {
    console.error("Error executing query:", error);
  } finally {
    await pool.end();
  }
}

checkAndFixEnum();
