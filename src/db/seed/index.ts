import { drizzle } from 'drizzle-orm/node-postgres';
import { seed  } from 'drizzle-seed';
import * as schema from '../schema';

// refinements
import { getAdvocateRefinements } from './advocates';

type RefinementCallback = Parameters<ReturnType<typeof seed>['refine']>[0]; ;
export type SeedingUtils = Parameters<RefinementCallback>[0];
export type Refinement = ReturnType<RefinementCallback>[keyof ReturnType<RefinementCallback>];


const refinements: [string, (utils: SeedingUtils) => Refinement][] = [
  ['advocates', getAdvocateRefinements],
]

async function main(refinements: [key: string, callback: (utils: SeedingUtils) => Refinement][]) {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL || '')

  await seed(db, schema).refine((utils) => (refinements.reduce((acc, [key, callback]) => {
    acc[key] = callback(utils);
    return acc;
  }, {} as Record<string, Refinement>)));
}

main(refinements)
  .then(() => {
    console.log("✅ Seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding the database:", error);
    process.exit(1);
  });