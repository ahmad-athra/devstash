import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as bcrypt from "bcryptjs";
import { MOCK_ITEMS, MOCK_COLLECTIONS, MOCK_ITEM_TYPES } from "../src/lib/mockData";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SYSTEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { name: "link", icon: "Link", color: "#10b981", isSystem: true },
  { name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { name: "image", icon: "Image", color: "#ec4899", isSystem: true },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed System Item Types
  console.log("-> Seeding system item types...");
  for (const type of SYSTEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });

    if (existing) {
      await prisma.itemType.update({
        where: { id: existing.id },
        data: type,
      });
    } else {
      await prisma.itemType.create({
        data: type,
      });
    }
  }

  const dbItemTypes = await prisma.itemType.findMany({ where: { isSystem: true } });
  
  // Helper to resolve mock Type ID to real DB Type ID
  const getDbTypeId = (mockTypeName: string) => {
    const found = dbItemTypes.find(t => t.name === mockTypeName);
    if (!found) throw new Error(`Could not find DB ItemType for ${mockTypeName}`);
    return found.id;
  };

  // 2. Seed Demo User
  console.log("-> Seeding Demo User...");
  const hashedPassword = await bcrypt.hash("12345678", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {
      password: hashedPassword, // Ensure password is set just in case
    },
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  // 3. Seed Mock Collections & Items (skip in production unless forced)
  const shouldSeedMockData = process.env.NODE_ENV !== "production" || process.env.SEED_MOCK_DATA === "true";

  if (shouldSeedMockData) {
    console.log("-> Seeding Mock Collections...");
    for (const col of MOCK_COLLECTIONS) {
      // In mock data, defaultTypeId points to "type-snippet" etc.
      let dbDefaultTypeId: string | null = null;
      if (col.defaultTypeId) {
        // Find the name of the type from MOCK_ITEM_TYPES
        const mockTypeObj = Object.values(MOCK_ITEM_TYPES).find(t => t.id === col.defaultTypeId);
        if (mockTypeObj) {
          dbDefaultTypeId = getDbTypeId(mockTypeObj.name);
        }
      }

      await prisma.collection.upsert({
        where: { id: col.id },
        update: {},
        create: {
          id: col.id,
          name: col.name,
          description: col.description,
          isFavorite: col.isFavorite,
          defaultTypeId: dbDefaultTypeId,
          userId: demoUser.id,
          createdAt: new Date(col.createdAt),
          updatedAt: new Date(col.updatedAt),
        },
      });
    }

    // 4. Seed Mock Items
    console.log("-> Seeding Mock Items & Tags...");
    for (const item of MOCK_ITEMS) {
      const dbItemTypeId = getDbTypeId(item.itemType.name);

      await prisma.item.upsert({
        where: { id: item.id },
        update: {},
        create: {
          id: item.id,
          title: item.title,
          description: item.description,
          contentType: item.contentType,
          content: item.content,
          url: item.url,
          fileUrl: item.fileUrl,
          fileName: item.fileName,
          fileSize: item.fileSize,
          language: item.language,
          isFavorite: item.isFavorite,
          isPinned: item.isPinned,
          userId: demoUser.id,
          itemTypeId: dbItemTypeId,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          tags: {
            create: item.tags?.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag.name },
                  create: { name: tag.name },
                },
              },
            })),
          },
          collections: {
            create: item.collections?.map((col) => ({
              collection: {
                connect: { id: col.id },
              },
            })),
          },
        },
      });
    }
  } else {
    console.log("-> Skipping mock collections and items seeding (Production/Non-development environment).");
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
