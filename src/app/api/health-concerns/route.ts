import db from "@/db";
import { specialties } from "@/db/schema";

export async function GET() {
  const concerns = await db.select()
    .from(specialties)
    .execute();

  return Response.json({ concerns });
}
