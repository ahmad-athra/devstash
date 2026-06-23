import { ItemType, Item, Collection, User } from '@/types/dashboard';

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

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Ahmad AbuAtherah',
  email: 'ahmad@devstash.io',
  isPro: true,
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-23T21:15:59Z',
};

const item1: Item = {
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
};

const item2: Item = {
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
  isPinned: true,
  itemType: MOCK_ITEM_TYPES.prompt,
  tags: [{ id: 't4', name: 'ai' }, { id: 't5', name: 'claude' }, { id: 't6', name: 'prompting' }],
  collections: [{ id: 'col-5', name: 'Prompt Library' }],
  createdAt: '2026-06-21T09:15:00Z',
  updatedAt: '2026-06-21T09:15:00Z',
};

const item3: Item = {
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
  collections: [{ id: 'col-6', name: 'DevOps & Cloud' }],
  createdAt: '2026-06-18T16:40:00Z',
  updatedAt: '2026-06-18T16:40:00Z',
};

const item4: Item = {
  id: 'item-4',
  title: 'Next.js v16 Dynamic Middleware Config',
  description: 'Note on configuring routing protection and tenant isolation in Next.js 16 app routers.',
  contentType: 'TEXT',
  content: `To enable multi-tenant isolation at routing level:
- Extract 'x-tenant-id' header in requests.
- Rewrite url paths to include sub-domains internally if needed.
- Cache user tenant lookups in memory for max 5 minutes using simple Map structures.`,
  isFavorite: false,
  isPinned: true,
  itemType: MOCK_ITEM_TYPES.note,
  tags: [{ id: 't10', name: 'nextjs' }, { id: 't11', name: 'architecture' }, { id: 't12', name: 'tenant' }],
  collections: [{ id: 'col-2', name: 'Context Files' }],
  createdAt: '2026-06-20T08:30:00Z',
  updatedAt: '2026-06-21T18:22:00Z',
};

const item5: Item = {
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
};

const item6: Item = {
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
};

const item7: Item = {
  id: 'item-7',
  title: 'DevStash Brand Mockup',
  description: 'Primary dark-themed dashboard mockup image draft.',
  contentType: 'FILE',
  fileName: 'dashboard_v1_concept.png',
  fileSize: 1245000,
  fileUrl: '#mock-url-png',
  isFavorite: true,
  isPinned: true,
  itemType: MOCK_ITEM_TYPES.image,
  tags: [{ id: 't19', name: 'design' }, { id: 't20', name: 'figma' }, { id: 't21', name: 'assets' }],
  collections: [{ id: 'col-2', name: 'Context Files' }, { id: 'col-7', name: 'UI & Design Assets' }],
  createdAt: '2026-06-21T14:00:00Z',
  updatedAt: '2026-06-21T14:00:00Z',
};

const item8: Item = {
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
};

const item9: Item = {
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
};

const item10: Item = {
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
};

const item11: Item = {
  id: 'item-11',
  title: 'Terraform AWS VPC Config',
  description: 'Production-ready VPC configuration with public/private subnets and NAT gateway.',
  contentType: 'TEXT',
  content: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "devstash-prod-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Environment = "production"
    Owner       = "SRE-Team"
  }
}`,
  language: 'hcl',
  isFavorite: false,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.snippet,
  tags: [{ id: 't26', name: 'terraform' }, { id: 't8', name: 'devops' }, { id: 't27', name: 'aws' }],
  collections: [{ id: 'col-6', name: 'DevOps & Cloud' }],
  createdAt: '2026-06-23T10:00:00Z',
  updatedAt: '2026-06-23T10:00:00Z',
};

const item12: Item = {
  id: 'item-12',
  title: 'K8s Force Restart Pod',
  description: 'Command to force recreate pods under a deployment without downtime.',
  contentType: 'TEXT',
  content: 'kubectl rollout restart deployment/devstash-api -n production',
  language: 'bash',
  isFavorite: true,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.command,
  tags: [{ id: 't28', name: 'kubernetes' }, { id: 't8', name: 'devops' }, { id: 't9', name: 'cli' }],
  collections: [{ id: 'col-6', name: 'DevOps & Cloud' }],
  createdAt: '2026-06-23T11:30:00Z',
  updatedAt: '2026-06-23T11:30:00Z',
};

const item13: Item = {
  id: 'item-13',
  title: 'Glassmorphism Card CSS',
  description: 'Reusable CSS variables and classes for premium glass UI card effects.',
  contentType: 'TEXT',
  content: `.glass-card {
  background: rgba(15, 15, 18, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
}`,
  language: 'css',
  isFavorite: false,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.snippet,
  tags: [{ id: 't15', name: 'css' }, { id: 't19', name: 'design' }, { id: 't3', name: 'frontend' }],
  collections: [{ id: 'col-7', name: 'UI & Design Assets' }],
  createdAt: '2026-06-23T14:00:00Z',
  updatedAt: '2026-06-23T14:00:00Z',
};

const item14: Item = {
  id: 'item-14',
  title: 'DevStash Icon Set SVG',
  description: 'Custom SVG icons package exported from Figma for core dashboard elements.',
  contentType: 'FILE',
  fileName: 'devstash_ui_icons.png',
  fileSize: 524000,
  fileUrl: '#mock-url-icons',
  isFavorite: false,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.image,
  tags: [{ id: 't19', name: 'design' }, { id: 't20', name: 'figma' }, { id: 't21', name: 'assets' }],
  collections: [{ id: 'col-7', name: 'UI & Design Assets' }],
  createdAt: '2026-06-22T16:00:00Z',
  updatedAt: '2026-06-22T16:00:00Z',
};

const item15: Item = {
  id: 'item-15',
  title: 'NestJS JWT Auth Guard',
  description: 'Custom guard extending passport JWT strategy with multi-tenant domain checks.',
  contentType: 'TEXT',
  content: `import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];
    if (!tenantId) {
      throw new UnauthorizedException('Tenant context is required');
    }
    return super.canActivate(context);
  }
}`,
  language: 'typescript',
  isFavorite: true,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.snippet,
  tags: [{ id: 't29', name: 'nestjs' }, { id: 't24', name: 'backend' }, { id: 't12', name: 'tenant' }],
  collections: [{ id: 'col-8', name: 'API & Backend' }],
  createdAt: '2026-06-23T09:00:00Z',
  updatedAt: '2026-06-23T09:30:00Z',
};

const item16: Item = {
  id: 'item-16',
  title: 'Pragmatic REST API Conventions',
  description: 'Internal guidelines for path naming, HTTP methods, and standardized JSON error payloads.',
  contentType: 'TEXT',
  content: `## REST Guidelines
1. Resource Paths: Always use plural nouns (e.g. /api/v1/collections)
2. HTTP Methods:
   - GET: Read resource(s)
   - POST: Create new resource
   - PUT: Replace resource or mass-update
   - PATCH: Partial resource update
   - DELETE: Remove resource
3. Standardization: Wrap dynamic response items in an array/object, and include a pagination meta block if applicable.`,
  language: 'markdown',
  isFavorite: false,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.note,
  tags: [{ id: 't24', name: 'backend' }, { id: 't11', name: 'architecture' }, { id: 't13', name: 'docs' }],
  collections: [{ id: 'col-8', name: 'API & Backend' }],
  createdAt: '2026-06-23T08:00:00Z',
  updatedAt: '2026-06-23T08:00:00Z',
};

const item17: Item = {
  id: 'item-17',
  title: 'Redis Redlock Implementation Helper',
  description: 'System prompt to guide AI in implementing race-condition-free distributed locking.',
  contentType: 'TEXT',
  content: `Explain step-by-step how to acquire, renew, and release a Redis lock safely across multiple server instances in Node.js/TypeScript. Avoid lock drift and handle connection timeouts.`,
  isFavorite: false,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.prompt,
  tags: [{ id: 't4', name: 'ai' }, { id: 't30', name: 'redis' }, { id: 't6', name: 'prompting' }],
  collections: [{ id: 'col-5', name: 'Prompt Library' }, { id: 'col-8', name: 'API & Backend' }],
  createdAt: '2026-06-23T15:20:00Z',
  updatedAt: '2026-06-23T15:20:00Z',
};

const item18: Item = {
  id: 'item-18',
  title: 'GitHub CI/CD Build & Test Pipeline',
  description: 'GitHub Actions workflow script to build, lint, and run unit tests on every pull request.',
  contentType: 'FILE',
  fileName: 'ci-pipeline.yml',
  fileSize: 1840,
  fileUrl: '#mock-url-ci',
  isFavorite: false,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.file,
  tags: [{ id: 't8', name: 'devops' }, { id: 't25', name: 'git' }, { id: 't31', name: 'yaml' }],
  collections: [{ id: 'col-6', name: 'DevOps & Cloud' }],
  createdAt: '2026-06-22T10:00:00Z',
  updatedAt: '2026-06-22T10:00:00Z',
};

const item19: Item = {
  id: 'item-19',
  title: 'Vite Config API Reference',
  description: 'Official reference documentation for configuring aliases, plugins, and CSS preprocessors in Vite.',
  contentType: 'URL',
  url: 'https://vite.dev/config/',
  isFavorite: false,
  isPinned: false,
  itemType: MOCK_ITEM_TYPES.link,
  tags: [{ id: 't13', name: 'docs' }, { id: 't3', name: 'frontend' }, { id: 't32', name: 'build' }],
  collections: [{ id: 'col-7', name: 'UI & Design Assets' }],
  createdAt: '2026-06-21T09:00:00Z',
  updatedAt: '2026-06-21T09:00:00Z',
};

export const MOCK_ITEMS: Item[] = [
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
  item7,
  item8,
  item9,
  item10,
  item11,
  item12,
  item13,
  item14,
  item15,
  item16,
  item17,
  item18,
  item19,
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'React Patterns',
    description: 'Production-ready React Hooks, Server Components context, and optimization tips.',
    isFavorite: true,
    defaultTypeId: 'type-snippet',
    itemCount: 2,
    items: [item1, item10],
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
    items: [item4, item6, item7],
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
    items: [item9],
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
    items: [item5, item8],
    createdAt: '2026-06-12T10:00:00Z',
    updatedAt: '2026-06-15T11:00:00Z',
  },
  {
    id: 'col-5',
    name: 'Prompt Library',
    description: 'Tested system messages and contextual prompt boilerplates.',
    isFavorite: false,
    defaultTypeId: 'type-prompt',
    itemCount: 2,
    items: [item2, item17],
    createdAt: '2026-06-21T08:00:00Z',
    updatedAt: '2026-06-23T15:20:00Z',
  },
  {
    id: 'col-6',
    name: 'DevOps & Cloud',
    description: 'Terraform configurations, Kubernetes shortcuts, and CI/CD pipelines.',
    isFavorite: true,
    defaultTypeId: 'type-command',
    itemCount: 4,
    items: [item3, item11, item12, item18],
    createdAt: '2026-06-22T08:00:00Z',
    updatedAt: '2026-06-23T11:30:00Z',
  },
  {
    id: 'col-7',
    name: 'UI & Design Assets',
    description: 'Figma templates, glassmorphism CSS, icons, and logo assets.',
    isFavorite: false,
    defaultTypeId: 'type-image',
    itemCount: 4,
    items: [item7, item13, item14, item19],
    createdAt: '2026-06-22T12:00:00Z',
    updatedAt: '2026-06-23T14:00:00Z',
  },
  {
    id: 'col-8',
    name: 'API & Backend',
    description: 'NestJS modules, REST guidelines, database migrations, and Redis scripts.',
    isFavorite: true,
    defaultTypeId: 'type-snippet',
    itemCount: 3,
    items: [item15, item16, item17],
    createdAt: '2026-06-23T07:00:00Z',
    updatedAt: '2026-06-23T15:20:00Z',
  },
];
