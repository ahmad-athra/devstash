-- CreateTable
CREATE TABLE "system_tier_limits" (
    "id" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "maxItems" INTEGER NOT NULL,
    "maxCollections" INTEGER NOT NULL,
    "fileUpload" BOOLEAN NOT NULL,
    "aiFeatures" BOOLEAN NOT NULL,
    "customTypes" BOOLEAN NOT NULL,
    "exportData" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_tier_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_tier_limits_tier_key" ON "system_tier_limits"("tier");
