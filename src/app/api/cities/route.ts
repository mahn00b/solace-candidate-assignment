import db from '../../../db'
import { advocates } from '@/db/schema';

export async function GET() {
  // const cities = [
  //   'New York, NY',
  //   'San Francisco, CA',
  //   'Austin, TX',
  //   'Boston, MA',
  //   'Seattle, WA',
  //   'Denver, CO',
  //   'Chicago, IL',
  //   'Los Angeles, CA',
  //   'Miami, FL',
  //   'Atlanta, GA',
  //   'Portland, OR',
  //   'Minneapolis, MN',
  //   'Nashville, TN',
  //   'Phoenix, AZ',
  //   'Philadelphia, PA',
  //   'Washington, DC',
  //   'San Diego, CA',
  //   'Dallas, TX',
  //   'Houston, TX',
  //   'Charlotte, NC',
  // ];

  const data = await db.selectDistinct({
      city: advocates.city,
    })
    .from(advocates)
    .execute()

  return Response.json({ cities: data });
}
