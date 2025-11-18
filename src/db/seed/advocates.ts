import type {
  DB,
  SeedingUtils,
} from '.';
import { advocates } from '../schema';
import { seed as seeder } from 'drizzle-seed';

const degrees = [
  "MD",
  "PhD",
  "MSW"
]

const getAdvocateRefinements = (func: SeedingUtils) => {
  return {
    advocates: {
      count: 100000,
      columns: {
        firstName: func.firstName(),
        lastName: func.lastName(),
        city: func.city(),
        degree: func.valuesFromArray({ values: degrees }),
        yearsOfExperience: func.number({ minValue: 1, maxValue: 30, precision: 1 }),
        phoneNumber: func.number({ minValue: 1000000000, maxValue: 9999999999, precision: 1 }),
        email: func.email(),
        background: func.loremIpsum({ sentencesCount: 3 }),
      }
    }
  }
}

export async function seed(db: DB) {
  return await seeder(db, { advocates }).refine(getAdvocateRefinements);
}