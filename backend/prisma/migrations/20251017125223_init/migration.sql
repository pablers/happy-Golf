-- CreateEnum
CREATE TYPE "public"."RoundType" AS ENUM ('FRONT', 'BACK', 'FULL');

-- CreateEnum
CREATE TYPE "public"."PracticeTime" AS ENUM ('NONE', 'MIN_5', 'MIN_5_15', 'MIN_15_PLUS');

-- CreateEnum
CREATE TYPE "public"."WeatherCondition" AS ENUM ('SUNNY', 'CLOUDY', 'RAINY', 'VARIABLE');

-- CreateEnum
CREATE TYPE "public"."WindCondition" AS ENUM ('NONE', 'LIGHT', 'MODERATE', 'STRONG');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trainingObjective" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HcpRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hcp" DOUBLE PRECISION NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "HcpRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Round" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "roundType" "public"."RoundType" NOT NULL,
    "practiceTime" "public"."PracticeTime" NOT NULL,
    "weather" "public"."WeatherCondition" NOT NULL,
    "wind" "public"."WindCondition" NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GolfCourse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "municipality" TEXT,
    "province" TEXT,
    "region" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "url" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "GolfCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HoleScore" (
    "id" TEXT NOT NULL,
    "hole" INTEGER NOT NULL,
    "par" INTEGER NOT NULL,
    "strokeIndex" INTEGER NOT NULL,
    "strokes" INTEGER,
    "putts" INTEGER,
    "comment" TEXT,
    "fairwayHit" BOOLEAN,
    "roundId" TEXT NOT NULL,

    CONSTRAINT "HoleScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_FavoriteCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FavoriteCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE INDEX "_FavoriteCourses_B_index" ON "public"."_FavoriteCourses"("B");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HcpRecord" ADD CONSTRAINT "HcpRecord_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Round" ADD CONSTRAINT "Round_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Round" ADD CONSTRAINT "Round_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."GolfCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HoleScore" ADD CONSTRAINT "HoleScore_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FavoriteCourses" ADD CONSTRAINT "_FavoriteCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."GolfCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FavoriteCourses" ADD CONSTRAINT "_FavoriteCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
