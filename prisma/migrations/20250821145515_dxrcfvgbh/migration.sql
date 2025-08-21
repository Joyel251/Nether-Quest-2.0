-- AlterTable
ALTER TABLE "public"."round1" ADD COLUMN     "clue" TEXT;

-- CreateTable
CREATE TABLE "public"."round2" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "clue" TEXT,
    "Submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "round2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round2Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "submissionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round2Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round3" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "clue" TEXT,
    "Submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "round3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round3Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "submissionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round3Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round4" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "clue" TEXT,
    "Submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "round4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round4Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "submissionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round4Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round5" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "clue" TEXT,
    "Submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "round5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round5Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "submissionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round5Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round6" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "clue" TEXT,
    "Submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "round6_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round6Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "submissionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round6Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "round2_teamNumber_key" ON "public"."round2"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round2Submission_teamNumber_key" ON "public"."round2Submission"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round3_teamNumber_key" ON "public"."round3"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round3Submission_teamNumber_key" ON "public"."round3Submission"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round4_teamNumber_key" ON "public"."round4"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round4Submission_teamNumber_key" ON "public"."round4Submission"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round5_teamNumber_key" ON "public"."round5"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round5Submission_teamNumber_key" ON "public"."round5Submission"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round6_teamNumber_key" ON "public"."round6"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round6Submission_teamNumber_key" ON "public"."round6Submission"("teamNumber");
