export type ContentType = 'TEXT' | 'URL' | 'FILE';

export interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  contentType: ContentType;
  proOnly: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  title: string;
  description?: string;
  contentType: ContentType;
  content?: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  language?: string;
  isFavorite: boolean;
  isPinned: boolean;
  itemType: ItemType;
  tags: Tag[];
  collections: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  isFavorite: boolean;
  defaultTypeId?: string;
  itemCount: number;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}
