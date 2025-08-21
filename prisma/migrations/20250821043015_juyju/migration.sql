/*
  Warnings:

  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."teams";

-- CreateTable
CREATE TABLE "public"."round1" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "Submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "round1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round1Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,

    CONSTRAINT "round1Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "round1_teamNumber_key" ON "public"."round1"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round1Submission_teamNumber_key" ON "public"."round1Submission"("teamNumber");
