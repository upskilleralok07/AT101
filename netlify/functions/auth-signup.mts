import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users, profiles } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { pbkdf2Sync, randomBytes } from "crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let name: string, email: string, password: string;
  try {
    ({ name, email, password } = await req.json());
  } catch {
    return Response.json({ detail: "Invalid request body" }, { status: 400 });
  }

  if (!name || !email || !password) {
    return Response.json({ detail: "All fields are required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [existing] = await db.select().from(users).where(eq(users.email, normalizedEmail));
  if (existing) {
    return Response.json({ detail: "This email is already registered." }, { status: 400 });
  }

  const [newUser] = await db
    .insert(users)
    .values({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
    })
    .returning();

  await db.insert(profiles).values({
    userId: newUser.id,
    bio: "",
    skills: "",
    certificates: "[]",
    achievements: "[]",
    socialLinks: "{}",
    photoUrl: "",
  });

  return Response.json({ message: "Account created successfully. Please login." });
};

export const config: Config = {
  path: "/api/auth/signup",
};
