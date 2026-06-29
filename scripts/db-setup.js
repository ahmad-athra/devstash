const { execSync } = require('child_process');

try {
  require('dotenv').config();
} catch (e) {
  // Ignore if dotenv is not available
}

console.log("🔍 Checking database connection environment...");

if (!process.env.DATABASE_URL) {
  console.log("⚠️ DATABASE_URL is not defined in the environment.");
  console.log("Skipping database migrations and seeding.");
  process.exit(0);
}

try {
  console.log("🔄 DATABASE_URL found. Running Prisma migrations ('prisma migrate deploy')...");
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  console.log("🌱 Seeding database ('prisma db seed')...");
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log("✅ Database migration and seeding completed successfully.");
} catch (error) {
  console.error("❌ Database migration or seeding failed:", error);
  process.exit(1);
}
