import { prisma } from '../prisma';
import { Item } from '@/types/dashboard';
import { mapItem } from '../utils';

// Fetch all items for the specified user (or default demo user) from the database
export async function getItems(userId?: string): Promise<Item[]> {
  let targetUserId = userId;

  if (!targetUserId) {
    // Find the seeded demo user
    let user = await prisma.user.findUnique({
      where: { email: 'demo@devstash.io' },
    });

    if (!user) {
      // Fallback to first user in the database if demo user doesn't exist
      user = await prisma.user.findFirst();
    }
    
    targetUserId = user?.id;
  }

  if (!targetUserId) {
    return [];
  }

  const dbItems = await prisma.item.findMany({
    where: {
      userId: targetUserId,
    },
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
    orderBy: {
      createdAt: 'desc',
    },
  });

  return dbItems.map(mapItem);
}
