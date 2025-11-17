import { drizzle } from 'drizzle-orm/node-postgres';
import { seed  } from 'drizzle-seed';
import { seed as seedAdvocates } from './advocates';
import { seed as seedSpecializations } from './specializations';
import { seed as seedAdvocateSpecializations } from './advocate_specializations';


type RefinementCallback = Parameters<ReturnType<typeof seed>['refine']>[0];
export type DB = ReturnType<typeof drizzle>;
export type SeedingUtils = Parameters<RefinementCallback>[0];
export type SeedingFunction = (db: DB) => Promise<void>;

const seed_confs: [string, SeedingFunction][] = [
  ["advocates", seedAdvocates],
  ["specialties", seedSpecializations],
  ["advocate_specialties", seedAdvocateSpecializations],
]

async function main(seeds: [string, SeedingFunction][]) {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL || '')

  for (const [tableName, seedFunction] of seeds) {
    console.log(`Seeding ${tableName}...`);
    await seedFunction(db);
    console.log(`✅ Finished seeding ${tableName}`);
  }
}

main(seed_confs)
  .then(() => {
    console.log("✅ Seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding the database:", error);
    process.exit(1);
  });