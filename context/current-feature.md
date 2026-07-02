# Current Feature

None

## Status

Completed

## Goals

None

## History

- **Dashboard UI Phase 1**: Initial layout and ShadCN UI components integration.
- **Dashboard UI Phase 2**: Refactored the dashboard layout to use a client-side persistent React Context (`DashboardProvider`) and dynamic route pathname-derived filters.
- **Dashboard UI Phase 3**: Implemented premium widgets layout for Dashboard Home.
- **SSR Refactor & Grid Layout Updates**: Refactored the `/dashboard` and `/items/[type]` pages from Client Components to Server Components, ensuring all structural UI is server-side rendered. Built a responsive cockpit layout with side-by-side rows on large screens and a compact, stacked list design on mobile.
- **User Confirmation Alerts**: Implemented custom confirmation modal alerts for adding/saving, deleting, pinning/unpinning, favoriting/unfavoriting items, and favoriting collections. Actions are fully color-coded (red, blue, gold, green) with decoupled lifecycle success callbacks.
- **Prisma + Neon PostgreSQL Setup**: Connected to Neon PostgreSQL (serverless), created the initial schema based on data models in `project-overview.md` including NextAuth models, added appropriate indexes/cascade deletes, generated the Prisma client, and successfully ran database migrations and seeded system item types using `pg` and `@prisma/adapter-pg`.
- **Seed Fake Data**: Created a comprehensive seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos. Created a Demo User (`demo@devstash.io`) with a hashed password using bcryptjs. Ensured System Item Types are seeded correctly and seeded dummy Collections and Items drawing from `src/lib/mockData.ts`.
- **Dashboard Collections & Breadcrumbs Enhancement**: Replaced mock cockpit data with actual collections fetched server-side from PostgreSQL via Prisma. Implemented custom folder theme color utilities mapping from collection item types, integrated responsive ShadCN Breadcrumb navigation trails, resolved Next.js router/browser race conditions by configuring direct declarative `Link` routes, and preserved filter states and navigation histories (including dynamic parent linkages) by introducing a context state tracking parameter.
- **Dashboard Items**: Replaced mock item data in the main area of the dashboard (recent and pinned items) with actual database records using Prisma and Neon PostgreSQL. Created a data fetching helper for stashed items under `src/lib/db/items.ts`. Configured parallel database queries in the workspace layout component. Relocated database mapping utilities (`mapItem`, `mapItemType`, `mapContentType`, `mapProOnly`) to a shared helper module in `src/lib/utils.ts`. Configured the Pinned Items widget to hide completely when there are no pinned items and optimized the layout to expand the Favorite Items section dynamically.
- **Stats & Sidebar**: Fetched and displayed system item types dynamically from the PostgreSQL database in the sidebar, replacing `MOCK_ITEM_TYPES`. Integrated a new database helper `src/lib/db/itemType.ts` to query system types, passing them to layout and context state. Configured the recent collections list in the sidebar to render colored indicator circles (representing the dominant item type color in the folder) instead of folder icons, and added a "View all collections" link. Created dedicated route pages (`/collections`) to show all database-driven collection cards, and cleaned up mock collections breadcrumb resolution.
- **Sidebar Item Counts**: Implemented dynamic real-time item count badges next to the primary filters (Dashboard Home, Favorites), item types, and collections (Favorite Collections, Recent Collections) in the sidebar. Refactored the item type navigation links with custom left-border highlights using CSS variables (`--type-color`) and `color-mix` to focus on hover/selection. Removed icon background containers for a cleaner direct rendering. Replaced the checkmark pro icon with an inline colored `"PRO"` text label placed left of the count badge, while supporting collapsible toggle hiding.
