import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Collection, Item, ItemType, ContentType } from "@/types/dashboard"
import { MOCK_ITEM_TYPES } from "@/lib/mockData"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCollectionThemeColor(col: Collection): string {
  if (col.items && col.items.length > 0) {
    const counts: Record<string, { count: number; color: string }> = {};
    col.items.forEach((item) => {
      const color = item.itemType?.color || "#a1a1aa";
      const name = item.itemType?.name || "note";
      if (!counts[name]) {
        counts[name] = { count: 0, color };
      }
      counts[name].count++;
    });

    let maxCount = -1;
    let themeColor = "#a1a1aa";
    Object.values(counts).forEach((info) => {
      if (info.count > maxCount) {
        maxCount = info.count;
        themeColor = info.color;
      }
    });
    return themeColor;
  }

  const itemTypeKey = col.defaultTypeId?.replace("type-", "") || "note";
  const typeConfig = MOCK_ITEM_TYPES[itemTypeKey] || MOCK_ITEM_TYPES.note;
  return typeConfig.color;
}

// Helper to map DB content type
export function mapContentType(typeName: string): ContentType {
  const lower = typeName.toLowerCase();
  if (lower === 'link') return 'URL';
  if (lower === 'file' || lower === 'image') return 'FILE';
  return 'TEXT';
}

// Helper to map DB proOnly item types
export function mapProOnly(typeName: string): boolean {
  const lower = typeName.toLowerCase();
  return lower === 'file' || lower === 'image';
}

// Helper to map DB ItemType to UI ItemType
export function mapItemType(dbType: any): ItemType {
  return {
    id: `type-${dbType.name.toLowerCase()}`,
    name: dbType.name,
    icon: dbType.icon,
    color: dbType.color,
    contentType: mapContentType(dbType.name),
    proOnly: mapProOnly(dbType.name),
  };
}

// Helper to map DB Item to UI Item
export function mapItem(dbItem: any): Item {
  return {
    id: dbItem.id,
    title: dbItem.title,
    description: dbItem.description || undefined,
    contentType: dbItem.contentType as ContentType,
    content: dbItem.content || undefined,
    url: dbItem.url || undefined,
    fileUrl: dbItem.fileUrl || undefined,
    fileName: dbItem.fileName || undefined,
    fileSize: dbItem.fileSize || undefined,
    language: dbItem.language || undefined,
    isFavorite: dbItem.isFavorite,
    isPinned: dbItem.isPinned,
    itemType: mapItemType(dbItem.itemType),
    tags: dbItem.tags.map((t: any) => ({
      id: t.tag.id,
      name: t.tag.name,
    })),
    collections: dbItem.collections.map((c: any) => ({
      id: c.collection.id,
      name: c.collection.name,
    })),
    createdAt: dbItem.createdAt.toISOString(),
    updatedAt: dbItem.updatedAt.toISOString(),
  };
}

