import * as schema from "../schema";
import { reset } from "drizzle-seed";
import { drizzle } from "drizzle-orm/node-postgres";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  console.log("Resetting database...");
  await reset(db, schema);
  console.log("✅ Database reset successfully");
}

main();