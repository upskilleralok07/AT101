import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { pbkdf2Sync } from "crypto";

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const newHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hash === newHash;
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let email: string, password: string;
  try {
    ({ email, password } = await req.json());
  } catch {
    return Response.json({ detail: "Invalid request body" }, { status: 400 });
  }

  if (!email || !password) {
    return Response.json({ detail: "Email and password required" }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ detail: "Invalid email or password" }, { status: 401 });
  }

  return Response.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const config: Config = {
  path: "/api/auth/login",
};
