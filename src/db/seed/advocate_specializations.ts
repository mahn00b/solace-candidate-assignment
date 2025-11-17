import { asc, gt } from "drizzle-orm";
import { DB } from ".";
import { advocates, specialties, advocate_specialties } from "../schema";

const getNextPage = async (
  db: DB,
  cursor: { id: number, createdAt: Date } | null,
  pageSize: number = 250
) => {
 let data: any[] = [];

  if (cursor === null) {
    data = await db.select({
      id: advocates.id,
      createdAt: advocates.createdAt,
    })
    .from(advocates)
    .orderBy(asc(advocates.createdAt))
    .limit(pageSize)
    .execute();
   } else {
      data = await db.select({
        id: advocates.id,
        createdAt: advocates.createdAt,
      })
      .from(advocates)
      .where(
        gt(advocates.createdAt, cursor.createdAt)
      )
      .orderBy(asc(advocates.createdAt))
      .limit(pageSize)
      .execute();
    }

    if (data.length === 0) {
      return null;
    }

  const lastRecord = data[data.length - 1] as { id: number, createdAt: Date };

  return {
    cursor: {
      id: lastRecord.id,
      createdAt: lastRecord.createdAt,
    },
    data
  };
}

export async function seed(db: DB) {
  let cursor: { id: number, createdAt: Date } | null = null;

  const specializations = await db.select({
    id: specialties.id
  }).from(specialties);

  const specializationIds = specializations.map(s => s.id);

  if (specializationIds.length === 0) {
    console.log("No specialties found in database. Skipping advocate_specializations seeding.");
    return;
  }

  let pageCount = 0;
  while (true) {
    const result = await getNextPage(db, cursor);

    if (!result) {
      break;
    }

    cursor = result.cursor;
    const advocatesPage = result.data;
    pageCount++;

    const advocateSpecializationsToInsert = [];

    for (const advocate of advocatesPage) {
      // Random number of specializations between 1 and 5
      const numSpecializations = Math.floor(Math.random() * 5) + 1;

      // Create a shuffled copy of specialization IDs to ensure uniqueness
      const shuffledIds = [...specializationIds].sort(() => Math.random() - 0.5);

      // Take the first numSpecializations from the shuffled array
      const selectedSpecializations = shuffledIds.slice(0, Math.min(numSpecializations, specializationIds.length));

      for (const specialtyId of selectedSpecializations) {
        advocateSpecializationsToInsert.push({
          advocateId: advocate.id,
          specialtyId: specialtyId,
        });
      }
    }

    if (advocateSpecializationsToInsert.length > 0) {
      await db.insert(advocate_specialties).values(advocateSpecializationsToInsert);
    }
  }

  return await Promise.resolve();
}

