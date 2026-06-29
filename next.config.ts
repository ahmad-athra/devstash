import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export default async function nextConfig(phase: string): Promise<NextConfig> {
  if (phase === PHASE_PRODUCTION_BUILD) {
    console.log("🔍 Checking database connection for build-time migrations...");
    if (process.env.DATABASE_URL) {
      try {
        const { execSync } = await import("child_process");
        console.log("🔄 DATABASE_URL found. Running Prisma migrations ('prisma migrate deploy')...");
        execSync("npx prisma migrate deploy", { stdio: "inherit" });
        console.log("🌱 Seeding database ('prisma db seed')...");
        execSync("npx prisma db seed", { stdio: "inherit" });
        console.log("✅ Database migration and seeding completed successfully.");
      } catch (error) {
        console.error("❌ Database setup failed during build:", error);
        process.exit(1);
      }
    } else {
      console.log("⚠️ DATABASE_URL is not defined. Skipping build-time migrations/seeding.");
    }
  }

  return {
    /* config options here */
  };
}
