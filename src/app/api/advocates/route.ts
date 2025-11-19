import { and, eq, inArray, ilike, or } from 'drizzle-orm';
import db from '@/db';
import { advocate_specialties, advocates, specialties } from '@/db/schema';
import { AdvocateResult } from '@/app/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const healthConcernsParam = searchParams.get('healthConcerns') || '';
  const city = searchParams.get('city') || '';

  const healthConcernsArray = healthConcernsParam ? healthConcernsParam.split(',').map(c => c.trim()) : [];

  // Build filters conditionally
  const filters = [];

  // City filter (case-insensitive partial match)
  if (city) {
    filters.push(ilike(advocates.city, `%${city}%`));
  }

  // Health concerns filter (at least one matching specialty)
  if (healthConcernsArray.length > 0) {
    filters.push(inArray(specialties.name, healthConcernsArray));
  }

  // Name filter (search in first name or last name)
  if (query) {
    const nameParts = query.split(' ').filter(part => part.length > 0);
    if (nameParts.length > 0) {
      const nameFilters = nameParts.map(part =>
        or(
          ilike(advocates.firstName, `%${part}%`),
          ilike(advocates.lastName, `%${part}%`)
        )
      );
      filters.push(and(...nameFilters));
    }
  }

  const data = await db
    .select({
      advocates: {
          id: advocates.id,
          firstName: advocates.firstName,
          lastName: advocates.lastName,
          city: advocates.city,
          degree: advocates.degree,
          yearsOfExperience: advocates.yearsOfExperience,
          phoneNumber: advocates.phoneNumber,
          background: advocates.background,
          email: advocates.email,
        },
        specialties: specialties.name,
      })
    .from(advocates)
    .innerJoin(advocate_specialties, eq(advocate_specialties.advocateId, advocates.id))
    .innerJoin(specialties, eq(advocate_specialties.specialtyId, specialties.id))
    .where(filters.length > 0 ? and(...filters) : undefined)
    .execute();

  const result = data.reduce((
    acc: Record<string, AdvocateResult>,
    row: (typeof data)[number]
  ) => {
    const advocateId = row.advocates.id.toString();
    if (!acc[advocateId]) {
      acc[advocateId] = {
        id: row.advocates.id,
        firstName: row.advocates.firstName,
        lastName: row.advocates.lastName,
        city: row.advocates.city,
        degree: row.advocates.degree,
        yearsOfExperience: row.advocates.yearsOfExperience,
        phoneNumber: row.advocates.phoneNumber,
        email: row.advocates.email,
        background: row.advocates.background,
        specialties: [],
      } as AdvocateResult;
    }

    acc[advocateId].specialties.push(row.specialties);

    return acc;
  }, {} as Record<string, AdvocateResult>);

  return Response.json({ advocates: Array.from(Object.values(result)) });
}
