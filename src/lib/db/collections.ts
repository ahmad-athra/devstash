import { prisma } from '../prisma';
import { Collection } from '@/types/dashboard';
import { mapItem } from '../utils';


// Fetch all collections for the default demo user from the database
export async function getCollections(): Promise<Collection[]> {
  // Find the seeded demo user
  let user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
  });

  if (!user) {
    // Fallback to first user in the database if demo user doesn't exist
    user = await prisma.user.findFirst();
  }

  if (!user) {
    return [];
  }

  // Load all item types to map defaultTypeId cuids to names
  const itemTypes = await prisma.itemType.findMany();
  const typeMap = new Map(itemTypes.map(t => [t.id, t]));

  const dbCollections = await prisma.collection.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true,
              tags: {
                include: {
                  tag: true,
                },
              },
              collections: {
                include: {
                  collection: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return dbCollections.map((col) => {
    const items = col.items.map((ci) => mapItem(ci.item));
    
    // Resolve defaultTypeId cuid to 'type-name' format
    const defaultType = col.defaultTypeId ? typeMap.get(col.defaultTypeId) : null;
    const defaultTypeId = defaultType ? `type-${defaultType.name.toLowerCase()}` : undefined;

    return {
      id: col.id,
      name: col.name,
      description: col.description || undefined,
      isFavorite: col.isFavorite,
      defaultTypeId,
      itemCount: items.length,
      items,
      createdAt: col.createdAt.toISOString(),
      updatedAt: col.updatedAt.toISOString(),
    };
  });
}
