-- CreateTable
CREATE TABLE "public"."questionset" (
    "id" INTEGER NOT NULL,
    "clue1" TEXT NOT NULL,
    "clue2" TEXT NOT NULL,
    "clue3" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "questionset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round7Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "submissionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round7Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round8" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "clue1" TEXT NOT NULL,
    "clue2" TEXT NOT NULL,
    "Submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "round8_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round8Submission" (
    "id" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "submissionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round8Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "round7Submission_teamNumber_key" ON "public"."round7Submission"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round8_teamNumber_key" ON "public"."round8"("teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "round8Submission_teamNumber_key" ON "public"."round8Submission"("teamNumber");
