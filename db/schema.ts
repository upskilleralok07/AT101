import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bio: text().default(""),
  skills: text().default(""),
  certificates: text().default("[]"),
  achievements: text().default("[]"),
  socialLinks: text("social_links").default("{}"),
  photoUrl: text("photo_url").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});
