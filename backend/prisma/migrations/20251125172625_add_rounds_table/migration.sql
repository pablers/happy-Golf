/*
  Warnings:

  - The values [NONE,MIN_5,MIN_5_15,MIN_15_PLUS] on the enum `PracticeTime` will be removed. If these variants are still used in the database, this will fail.
  - The values [FRONT,BACK,FULL] on the enum `RoundType` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUNNY,CLOUDY,RAINY,VARIABLE] on the enum `WeatherCondition` will be removed. If these variants are still used in the database, this will fail.
  - The values [NONE,LIGHT,MODERATE,STRONG] on the enum `WindCondition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PracticeTime_new" AS ENUM ('none', '5min', '5-15min', '15+min');
ALTER TABLE "public"."Round" ALTER COLUMN "practiceTime" TYPE "public"."PracticeTime_new" USING ("practiceTime"::text::"public"."PracticeTime_new");
ALTER TYPE "public"."PracticeTime" RENAME TO "PracticeTime_old";
ALTER TYPE "public"."PracticeTime_new" RENAME TO "PracticeTime";
DROP TYPE "public"."PracticeTime_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."RoundType_new" AS ENUM ('front', 'back', 'full');
ALTER TABLE "public"."Round" ALTER COLUMN "roundType" TYPE "public"."RoundType_new" USING ("roundType"::text::"public"."RoundType_new");
ALTER TYPE "public"."RoundType" RENAME TO "RoundType_old";
ALTER TYPE "public"."RoundType_new" RENAME TO "RoundType";
DROP TYPE "public"."RoundType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."WeatherCondition_new" AS ENUM ('sunny', 'cloudy', 'rainy', 'variable');
ALTER TABLE "public"."Round" ALTER COLUMN "weather" TYPE "public"."WeatherCondition_new" USING ("weather"::text::"public"."WeatherCondition_new");
ALTER TYPE "public"."WeatherCondition" RENAME TO "WeatherCondition_old";
ALTER TYPE "public"."WeatherCondition_new" RENAME TO "WeatherCondition";
DROP TYPE "public"."WeatherCondition_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."WindCondition_new" AS ENUM ('none', 'light', 'moderate', 'strong');
ALTER TABLE "public"."Round" ALTER COLUMN "wind" TYPE "public"."WindCondition_new" USING ("wind"::text::"public"."WindCondition_new");
ALTER TYPE "public"."WindCondition" RENAME TO "WindCondition_old";
ALTER TYPE "public"."WindCondition_new" RENAME TO "WindCondition";
DROP TYPE "public"."WindCondition_old";
COMMIT;
