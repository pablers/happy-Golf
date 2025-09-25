-- DropForeignKey
ALTER TABLE "public"."HoleScore" DROP CONSTRAINT "HoleScore_roundId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostRoundAnswers" DROP CONSTRAINT "PostRoundAnswers_roundId_fkey";

-- AddForeignKey
ALTER TABLE "public"."HoleScore" ADD CONSTRAINT "HoleScore_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostRoundAnswers" ADD CONSTRAINT "PostRoundAnswers_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;
