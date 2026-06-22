import { ItemType, Item, Collection } from '@/types/dashboard';

export const MOCK_ITEM_TYPES: Record<string, ItemType> = {
  snippet: {
    id: 'type-snippet',
    name: 'snippet',
    icon: 'Code',
    color: '#3b82f6',
    contentType: 'TEXT',
    proOnly: false,
  },
  prompt: {
    id: 'type-prompt',
    name: 'prompt',
    icon: 'Sparkles',
    color: '#8b5cf6',
    contentType: 'TEXT',
    proOnly: false,
  },
  command: {
    id: 'type-command',
    name: 'command',
    icon: 'Terminal',
    color: '#f97316',
    contentType: 'TEXT',
    proOnly: false,
  },
  note: {
    id: 'type-note',
    name: 'note',
    icon: 'StickyNote',
    color: '#fde047',
    contentType: 'TEXT',
    proOnly: false,
  },
  link: {
    id: 'type-link',
    name: 'link',
    icon: 'Link',
    color: '#10b981',
    contentType: 'URL',
    proOnly: false,
  },
  file: {
    id: 'type-file',
    name: 'file',
    icon: 'File',
    color: '#6b7280',
    contentType: 'FILE',
    proOnly: true,
  },
  image: {
    id: 'type-image',
    name: 'image',
    icon: 'Image',
    color: '#ec4899',
    contentType: 'FILE',
    proOnly: true,
  },
};

export const MOCK_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'useLocalStorage Hook',
    description: 'A custom React hook to manage state synchronized with window.localStorage.',
    contentType: 'TEXT',
    content: `import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}`,
    language: 'typescript',
    isFavorite: true,
    isPinned: true,
    itemType: MOCK_ITEM_TYPES.snippet,
    tags: [{ id: 't1', name: 'react' }, { id: 't2', name: 'hooks' }, { id: 't3', name: 'frontend' }],
    collections: [{ id: 'col-1', name: 'React Patterns' }],
    createdAt: '2026-06-20T12:00:00Z',
    updatedAt: '2026-06-20T14:30:00Z',
  },
  {
    id: 'item-2',
    title: 'Claude 3.5 System Prompt',
    description: 'Standard coding persona prompt for software engineering subagents.',
    contentType: 'TEXT',
    content: `You are an expert principal engineer.
Follow coding guidelines strictly:
1. Always write robust error handling.
2. Keep dependencies minimal.
3. Document high-level designs.
4. Output structured, descriptive JSON formats.`,
    isFavorite: true,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.prompt,
    tags: [{ id: 't4', name: 'ai' }, { id: 't5', name: 'claude' }, { id: 't6', name: 'prompting' }],
    collections: [{ id: 'col-5', name: 'Prompt Library' }],
    createdAt: '2026-06-21T09:15:00Z',
    updatedAt: '2026-06-21T09:15:00Z',
  },
  {
    id: 'item-3',
    title: 'Docker Cleanup Command',
    description: 'Clean up unused containers, networks, images, and volumes.',
    contentType: 'TEXT',
    content: 'docker system prune -a --volumes --force',
    language: 'bash',
    isFavorite: false,
    isPinned: true,
    itemType: MOCK_ITEM_TYPES.command,
    tags: [{ id: 't7', name: 'docker' }, { id: 't8', name: 'devops' }, { id: 't9', name: 'cli' }],
    collections: [],
    createdAt: '2026-06-18T16:40:00Z',
    updatedAt: '2026-06-18T16:40:00Z',
  },
  {
    id: 'item-4',
    title: 'Next.js v16 Dynamic Middleware Config',
    description: 'Note on configuring routing protection and tenant isolation in Next.js 16 app routers.',
    contentType: 'TEXT',
    content: `To enable multi-tenant isolation at routing level:
- Extract 'x-tenant-id' header in requests.
- Rewrite url paths to include sub-domains internally if needed.
- Cache user tenant lookups in memory for max 5 minutes using simple Map structures.`,
    isFavorite: false,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.note,
    tags: [{ id: 't10', name: 'nextjs' }, { id: 't11', name: 'architecture' }, { id: 't12', name: 'tenant' }],
    collections: [{ id: 'col-2', name: 'Context Files' }],
    createdAt: '2026-06-20T08:30:00Z',
    updatedAt: '2026-06-21T18:22:00Z',
  },
  {
    id: 'item-5',
    title: 'shadcn/ui Documentation',
    description: 'Main landing page for shadcn/ui components styling guidelines.',
    contentType: 'URL',
    url: 'https://ui.shadcn.com',
    isFavorite: true,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.link,
    tags: [{ id: 't13', name: 'docs' }, { id: 't14', name: 'ui' }, { id: 't15', name: 'css' }],
    collections: [{ id: 'col-4', name: 'Interview Prep' }],
    createdAt: '2026-06-15T11:00:00Z',
    updatedAt: '2026-06-15T11:00:00Z',
  },
  {
    id: 'item-6',
    title: 'DevStash DB Migration v1.0',
    description: 'Initial schema setup migration file containing SQL tables definition.',
    contentType: 'FILE',
    fileName: '20260620_initial_schema.sql',
    fileSize: 4528,
    fileUrl: '#mock-url-sql',
    isFavorite: false,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.file,
    tags: [{ id: 't16', name: 'database' }, { id: 't17', name: 'prisma' }, { id: 't18', name: 'sql' }],
    collections: [{ id: 'col-2', name: 'Context Files' }],
    createdAt: '2026-06-20T02:00:00Z',
    updatedAt: '2026-06-20T02:00:00Z',
  },
  {
    id: 'item-7',
    title: 'DevStash Brand Mockup',
    description: 'Primary dark-themed dashboard mockup image draft.',
    contentType: 'FILE',
    fileName: 'dashboard_v1_concept.png',
    fileSize: 1245000,
    fileUrl: '#mock-url-png',
    isFavorite: true,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.image,
    tags: [{ id: 't19', name: 'design' }, { id: 't20', name: 'figma' }, { id: 't21', name: 'assets' }],
    collections: [{ id: 'col-2', name: 'Context Files' }],
    createdAt: '2026-06-21T14:00:00Z',
    updatedAt: '2026-06-21T14:00:00Z',
  },
  {
    id: 'item-8',
    title: 'SQL Query Plan Explainer',
    description: 'Quick walkthrough on understanding Postgres EXPLAIN outputs for slow queries.',
    contentType: 'TEXT',
    content: `Focus on:
1. Sequential scan (Seq Scan) -> Needs Indexes.
2. Hash Join vs Nested Loop -> Check memory buffers.
3. Actual time vs Estimated cost.`,
    isFavorite: false,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.note,
    tags: [{ id: 't16', name: 'database' }, { id: 't22', name: 'performance' }],
    collections: [{ id: 'col-4', name: 'Interview Prep' }],
    createdAt: '2026-06-12T15:20:00Z',
    updatedAt: '2026-06-12T15:20:00Z',
  },
  {
    id: 'item-9',
    title: 'FastAPI Boilerplate Repository',
    description: 'Clean setup for API backend using FastAPI, Pydantic, and SQLAlchemy.',
    contentType: 'URL',
    url: 'https://github.com/fastapi/fastapi',
    isFavorite: false,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.link,
    tags: [{ id: 't23', name: 'python' }, { id: 't24', name: 'backend' }, { id: 't25', name: 'git' }],
    collections: [{ id: 'col-3', name: 'Python Snippets' }],
    createdAt: '2026-06-10T10:10:00Z',
    updatedAt: '2026-06-10T10:10:00Z',
  },
  {
    id: 'item-10',
    title: 'React 19 Server Components Rules',
    description: 'Cheatsheet for implementing client-side interactivity on top of RSC nodes.',
    contentType: 'TEXT',
    content: `1. Import directives ("use client") must be at the very top.
2. Children passing patterns allows nesting RSC inside Client Components.
3. Actions handles promises natively via 'useTransition'.`,
    language: 'markdown',
    isFavorite: true,
    isPinned: false,
    itemType: MOCK_ITEM_TYPES.snippet,
    tags: [{ id: 't1', name: 'react' }, { id: 't10', name: 'nextjs' }],
    collections: [{ id: 'col-1', name: 'React Patterns' }],
    createdAt: '2026-06-22T08:00:00Z',
    updatedAt: '2026-06-22T08:45:00Z',
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'React Patterns',
    description: 'Production-ready React Hooks, Server Components context, and optimization tips.',
    isFavorite: true,
    defaultTypeId: 'type-snippet',
    itemCount: 2,
    items: [MOCK_ITEMS[0], MOCK_ITEMS[9]],
    createdAt: '2026-06-19T23:00:00Z',
    updatedAt: '2026-06-22T08:45:00Z',
  },
  {
    id: 'col-2',
    name: 'Context Files',
    description: 'System configurations, database migrations, and structural schemas.',
    isFavorite: false,
    defaultTypeId: 'type-file',
    itemCount: 3,
    items: [MOCK_ITEMS[3], MOCK_ITEMS[5], MOCK_ITEMS[6]],
    createdAt: '2026-06-20T01:00:00Z',
    updatedAt: '2026-06-21T18:22:00Z',
  },
  {
    id: 'col-3',
    name: 'Python Snippets',
    description: 'Collection of utility methods and API wrappers in Python.',
    isFavorite: false,
    defaultTypeId: 'type-link',
    itemCount: 1,
    items: [MOCK_ITEMS[8]],
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-06-10T10:10:00Z',
  },
  {
    id: 'col-4',
    name: 'Interview Prep',
    description: 'Important code examples, database optimizations notes, and key documentation.',
    isFavorite: true,
    defaultTypeId: 'type-note',
    itemCount: 2,
    items: [MOCK_ITEMS[4], MOCK_ITEMS[7]],
    createdAt: '2026-06-12T10:00:00Z',
    updatedAt: '2026-06-15T11:00:00Z',
  },
  {
    id: 'col-5',
    name: 'Prompt Library',
    description: 'Tested system messages and contextual prompt boilerplates.',
    isFavorite: false,
    defaultTypeId: 'type-prompt',
    itemCount: 1,
    items: [MOCK_ITEMS[1]],
    createdAt: '2026-06-21T08:00:00Z',
    updatedAt: '2026-06-21T09:15:00Z',
  },
];
