# Sidebar Item Counts Spec

## Overview

Enhance the DevStash sidebar navigation to display dynamic count badges for all primary navigation links, item types, and collection lists. These counts should represent the real-time size of the datasets filtered from the database, powered by the centralized application state in `DashboardContext`.

When the sidebar is in its collapsed state, these badges should be hidden to save space and maintain a clean user interface.

## Requirements

### 1. Count Calculations & Data Sources
Extract items directly from the existing `useDashboardContext()` context. All counts must be calculated efficiently using React `useMemo` hooks inside the sidebar component to prevent unnecessary calculations during re-renders.

- **Total Items Count:** Total number of all items owned by the user (`items.length`). Display next to the **Dashboard Home** menu item.
- **Favorites Count:** Number of items where `isFavorite` is true. Display next to the **Favorites** menu item.
- **Item Type Counts:** For each item type (e.g. Snippet, Prompt, Command, Note, Link, File, Image), filter items where the item type matches the specific category (`item.itemType.name === type.name` or `item.itemType.id === type.id`). Display next to each category label in the **Item Types** section.
- **Collection Item Counts:** Number of items in each collection. Since `Collection` objects contain `itemCount` and/or `items`, display the count next to the collection name under both **Favorite Collections** and **Recent Collections**.

### 2. UI/UX & Styling Guidelines
The badges must follow the DevStash design system, prioritizing rich aesthetics, readability, and modern dark-mode glassmorphic styling:

- **Visibility:** Only render count badges when the sidebar is expanded (`!isCollapsed`).
- **Layout:** Align count badges to the right side of the navigation links. Utilize flex layouts (`justify-between` and `items-center`) to keep links uniform and clean.
- **Design Tokens & Variables:** Use existing design variables (`var(--color-*)`) instead of hardcoded hex colors or inline styles.
- **Color Palette (Dark Mode):**
  - Background: Subtle semi-transparent dark background (e.g. `bg-zinc-900/60` or `bg-zinc-800/40`).
  - Text: High-contrast but muted text (e.g. `text-zinc-500` or `text-zinc-400`).
  - Borders: Thin, subtle border (`border border-zinc-800/80`).
- **Interactive States:** When hovering over a menu link, transition the badge's text color slightly for a premium feel (e.g. using Tailwind utility `group-hover:text-zinc-300 transition-colors`).
- **Accessibility (A11y):**
  - Include semantic ARIA labels on the badges where appropriate (e.g. `aria-label="Count: 12 items"`).
  - Ensure all text and background contrast ratios meet WCAG AA standards (minimum 4.5:1 ratio).

### 3. Sidebar Layout Integration

```tsx
// Example layout for Dashboard Home link:
<Link
  href="/dashboard"
  onClick={() => handleFilterClick('all')}
  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ..."
>
  <div className="flex items-center gap-3">
    <LayoutDashboard className="h-4.5 w-4.5 text-zinc-400" />
    <span>Dashboard Home</span>
  </div>
  <span 
    className="text-xs px-1.5 py-0.5 rounded-md bg-zinc-900 text-zinc-500 border border-zinc-800 font-mono group-hover:text-zinc-300 transition-colors"
    aria-label={`${totalItemsCount} total items`}
  >
    {totalItemsCount}
  </span>
</Link>
```

## References

- Context Hook: `@src/context/DashboardContext.tsx`
- Types Definitions: `@src/types/dashboard.ts`
- Component File: `@src/components/dashboard/Sidebar.tsx`
