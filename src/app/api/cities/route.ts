import db from '../../../db'
import { advocates } from '@/db/schema';

export async function GET() {
  const data = await db.selectDistinct({
      city: advocates.city,
    })
    .from(advocates)
    .execute()

  return Response.json({ cities: data.map((row) => row.city) });
}
