-- Rename password column to passwordHash for clarity and consistency
ALTER TABLE "public"."User" RENAME COLUMN "password" TO "passwordHash";
