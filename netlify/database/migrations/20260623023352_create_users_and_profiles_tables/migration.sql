CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"bio" text DEFAULT '',
	"skills" text DEFAULT '',
	"certificates" text DEFAULT '[]',
	"achievements" text DEFAULT '[]',
	"social_links" text DEFAULT '{}',
	"photo_url" text DEFAULT '',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");