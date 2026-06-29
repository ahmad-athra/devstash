import { prisma } from '../prisma';
import { ItemType } from '@/types/dashboard';
import { mapItemType } from '../utils';

// Fetch all system item types and sort them in the logical order: snippet, prompt, command, note, link, file, image
export async function getItemTypes(): Promise<ItemType[]> {
  const dbItemTypes = await prisma.itemType.findMany({
    where: {
      isSystem: true,
    },
  });

  const mapped = dbItemTypes.map(mapItemType);

  // Logical sorting order to match original design
  const typeOrder = ['snippet', 'prompt', 'command', 'note', 'link', 'file', 'image'];

  return mapped.sort((a, b) => {
    const idxA = typeOrder.indexOf(a.name.toLowerCase());
    const idxB = typeOrder.indexOf(b.name.toLowerCase());
    return idxA - idxB;
  });
}
