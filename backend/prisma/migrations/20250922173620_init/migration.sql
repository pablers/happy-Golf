-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "hcp" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Round" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "roundType" TEXT NOT NULL,
    "practiceTime" TEXT,
    "initialWeather" TEXT,
    "initialWind" TEXT,
    "turfCondition" TEXT,
    "greenSpeed" TEXT,
    "physicalState" TEXT,
    "mentalState" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HoleScore" (
    "id" TEXT NOT NULL,
    "hole" INTEGER NOT NULL,
    "strokes" INTEGER NOT NULL,
    "putts" INTEGER NOT NULL,
    "fairwayHit" BOOLEAN,
    "comment" TEXT,
    "roundId" TEXT NOT NULL,

    CONSTRAINT "HoleScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostRoundAnswers" (
    "id" TEXT NOT NULL,
    "weatherH7Confirm" TEXT,
    "weatherH7New" TEXT,
    "windH7Change" TEXT,
    "weatherH15Confirm" TEXT,
    "weatherH15New" TEXT,
    "windH15Change" TEXT,
    "roundId" TEXT NOT NULL,

    CONSTRAINT "PostRoundAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PostRoundAnswers_roundId_key" ON "public"."PostRoundAnswers"("roundId");

-- AddForeignKey
ALTER TABLE "public"."Round" ADD CONSTRAINT "Round_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HoleScore" ADD CONSTRAINT "HoleScore_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostRoundAnswers" ADD CONSTRAINT "PostRoundAnswers_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
