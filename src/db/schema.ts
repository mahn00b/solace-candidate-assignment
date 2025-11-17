import { table } from "console";
import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  serial,
  timestamp,
  bigint,
  index
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  email: text("email").notNull().unique(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),

}, (table) => [
  index("idx_advocates_city").on(table.city),
  index("idx_advocates_degree").on(table.degree),
  index("idx_advocates_years_of_experience").on(table.yearsOfExperience),
  index("idx_advocates_full_name").on(table.firstName, table.lastName),
]);

const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

const advocate_specialties = pgTable("advocate_specialties", {
  id: serial("id").primaryKey(),
  advocateId: integer("advocate_id")
    .notNull()
    .references(() => advocates.id, { onDelete: "cascade" }),
  specialtyId: integer("specialty_id")
    .notNull()
    .references(() => specialties.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_advocate_specialties_advocate_id").on(table.advocateId),
  index("idx_advocate_specialties_specialty_id").on(table.specialtyId),
]);

export { advocates, specialties, advocate_specialties };
