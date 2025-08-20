-- CreateTable
CREATE TABLE "public"."teams" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_teamName_key" ON "public"."teams"("teamName");
