import type { Config, Context } from "@netlify/functions";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request, context: Context) => {
  if (req.method === "GET") {
    const userId = parseInt(context.params.id);
    if (isNaN(userId)) {
      return Response.json({ detail: "Invalid user ID" }, { status: 400 });
    }

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    if (!profile) {
      return Response.json({ detail: "Profile not found." }, { status: 404 });
    }

    let certificates: unknown[] = [];
    let achievements: unknown[] = [];
    let social_links: Record<string, string> = {};

    try { certificates = JSON.parse(profile.certificates || "[]"); } catch { /* empty */ }
    try { achievements = JSON.parse(profile.achievements || "[]"); } catch { /* empty */ }
    try { social_links = JSON.parse(profile.socialLinks || "{}"); } catch { /* empty */ }

    return Response.json({
      profile: {
        id: profile.id,
        user_id: profile.userId,
        bio: profile.bio,
        skills: profile.skills,
        certificates,
        achievements,
        social_links,
        photo_url: profile.photoUrl,
      },
    });
  }

  if (req.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return Response.json({ detail: "Invalid request body" }, { status: 400 });
    }

    const { user_id, bio, skills, certificates, achievements, social_links, photo_url } = body as {
      user_id: number;
      bio?: string;
      skills?: string;
      certificates?: unknown[];
      achievements?: unknown[];
      social_links?: Record<string, string>;
      photo_url?: string;
    };

    if (!user_id) {
      return Response.json({ detail: "user_id required" }, { status: 400 });
    }

    await db
      .update(profiles)
      .set({
        bio: (bio as string) || "",
        skills: (skills as string) || "",
        certificates: JSON.stringify(certificates || []),
        achievements: JSON.stringify(achievements || []),
        socialLinks: JSON.stringify(social_links || {}),
        photoUrl: (photo_url as string) || "",
      })
      .where(eq(profiles.userId, user_id as number));

    return Response.json({ message: "Profile updated successfully." });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: ["/api/auth/profile", "/api/auth/profile/:id"],
};
