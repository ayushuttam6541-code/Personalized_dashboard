# PulseHub — Personalized Content Dashboard

A modern, high-performance, and responsive **Personalized Content Dashboard** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit**, **RTK Query**, **Framer Motion**, and **@dnd-kit**.

PulseHub aggregates content from diverse streams—including **News**, **Movie Recommendations**, and **Community Social Posts**—providing a unified, interactive, and customizable dashboard experience.

---

## 🌟 Key Features

### 1. Personalized Content Feed
- **Multi-Source Aggregation**: Seamlessly combines news articles, movie recommendations, and social media discussions into a single unified stream.
- **Dynamic Category Filtering**: Filter across Technology, Business, Entertainment, Sports, Science, and Health topics.
- **Type Filtering**: Quickly view All items, News only, Movies only, or Social posts only.
- **Auto-Refresh (Real-Time)**: Configurable background polling intervals (30s, 1m, 5m, or manual) to keep the feed current.

### 2. Interactive & Reusable Content Cards
- **Unified Schema (`ContentItem`)**: Renders consistent cards with distinct badges, category colors, and source provenance.
- **Type-Specific Metadata**:
  - **Movies**: Star ratings and community vote counts.
  - **Social Posts**: Author handles, like counts, and repost statistics.
  - **News**: Author bylines and estimated reading times.
- **Robust Error Handling**: Graceful fallback placeholders if external images fail to load or are broken.
- **Micro-Interactions**: Hover scale, heart animations, and one-click link copying.

### 3. Drag-and-Drop Organization (`@dnd-kit`)
- Rearrange feed cards with a drag handle.
- Reordered layouts are stored in Redux and automatically persisted to `localStorage`.
- One-click **"Reset Arrangement"** button restores default algorithmic curation.

### 4. Debounced Search Engine
- Custom `useDebounce` hook (350ms delay) prevents excessive queries on rapid keystrokes.
- Searches title, description, author, tag, and source.
- Immediate clear action with helpful empty state suggestions.

### 5. Bookmarks & Favorites Library
- Mark any card as a favorite with animated feedback.
- Dedicated `/favorites` page with category filters and bulk-clear options.
- State persists across page reloads and browser sessions via `localStorage`.

### 6. Preferences & Settings Panel
- Interactive topic multi-selector ensuring at least one interest is active.
- Theme switcher (Dark / Light mode).
- Real-time auto-refresh interval configuration.
- Cache and preferences reset controls.

### 7. Resilient Architecture & Fallback Engine
- Server-side Next.js route handlers (`/api/content` and `/api/trending`) integrate with live APIs (**NewsAPI**, **TMDB**) when environment keys are provided.
- If external API keys are omitted or external services hit rate limits (e.g., HTTP 429), the application provides realistic fallback data so reviewers and users can evaluate the platform immediately without broken states.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Dark Mode variables |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| **Drag & Drop** | [@dnd-kit/core](https://dndkit.com/) & [@dnd-kit/sortable](https://dndkit.com/) |
| **Animations & Icons** | [Lucide React](https://lucide.dev/) & CSS micro-animations |
| **Unit & Integration Testing** | [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/) |
| **End-to-End Testing** | [Playwright](https://playwright.dev/) |

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── content/route.ts      # Main content feed API with search, filters & pagination
│   │   └── trending/route.ts     # Trending items API ranked by engagement
│   ├── favorites/page.tsx        # Saved bookmarks page with empty state
│   ├── settings/page.tsx         # User preferences and appearance settings
│   ├── trending/page.tsx         # Top trending items across categories
│   ├── globals.css               # Design system & dark mode tokens
│   ├── layout.tsx                # App shell, font definitions, and root providers
│   └── page.tsx                  # Home dashboard feed
│
├── components/
│   ├── AppShell.tsx              # Responsive navigation wrapper
│   ├── ContentCard.tsx           # Reusable unified card component
│   ├── ContentGrid.tsx           # Sortable drag-and-drop grid (@dnd-kit)
│   ├── Dashboard.tsx             # Main dashboard feed controller
│   ├── EmptyState.tsx            # Contextual empty & search-not-found states
│   ├── ErrorState.tsx            # Error boundary with retry button
│   ├── Header.tsx                # Top navigation, theme toggle, and user profile
│   ├── LoadingState.tsx          # Card skeleton loading states
│   ├── SearchBar.tsx             # Accessible debounced search input
│   ├── SettingsPanel.tsx         # Preference configuration controls
│   ├── Sidebar.tsx               # Collapsible sidebar with active badges
│   └── StoreProvider.tsx         # Redux provider & theme synchronizer
│
├── hooks/
│   └── useDebounce.ts            # Reusable debounce hook
│
├── lib/
│   ├── mockData.ts               # Curated fallback dataset
│   └── utils.ts                  # Date formatting, numbers, classnames & storage
│
├── store/
│   ├── api.ts                    # RTK Query API slice with auto-caching
│   ├── favoritesSlice.ts         # Bookmarks slice with localStorage persistence
│   ├── preferencesSlice.ts       # User topic & theme preferences slice
│   └── store.ts                  # Root store and typed Redux hooks
│
└── types/
    └── content.ts                # TypeScript interfaces (ContentItem, Preferences, etc.)

e2e/
└── dashboard.spec.ts             # Playwright E2E test scenarios
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm** or **yarn** / **pnpm**

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/personalized-dashboard.git
cd personalized-dashboard
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your optional API keys:
```env
# Optional: Live external news via NewsAPI (https://newsapi.org/)
NEWS_API_KEY=your_news_api_key_here

# Optional: Live movie recommendations via TMDB (https://www.themoviedb.org/)
TMDB_API_KEY=your_tmdb_api_key_here
```
> **Note**: If keys are left blank, PulseHub seamlessly uses its built-in high-quality fallback engine with realistic data, so the entire app works out of the box without any setup.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🧪 Testing

PulseHub includes comprehensive automated test coverage for core business logic, user flows, and edge cases.

### Unit & Integration Tests (Vitest + React Testing Library)
Run the automated test suite:

```bash
npm run test
```

Watch mode for development:
```bash
npm run test:watch
```

**Coverage highlights**:
- `preferencesSlice.test.ts`: Category selection, minimum category constraint, theme toggling, auto-refresh interval, feed reorder and reset.
- `favoritesSlice.test.ts`: Duplicate bookmark prevention, removal, toggle states, and bulk clear.
- `useDebounce.test.ts`: Timer-based value throttling, cancellation on rapid input.
- `ContentCard.test.tsx`: Correct field rendering for news, movies, and social posts; favorite toggling.
- `SearchBar.test.tsx`: Search queries and clear actions.
- `SettingsPanel.test.tsx`: Preferences modifications and default restoration.
- `EmptyState.test.tsx`: Empty state messaging and action button triggers.

### End-to-End Tests (Playwright)
Run the browser end-to-end user journeys:

```bash
npm run test:e2e
```

**E2E scenarios covered**:
1. Dashboard initial load, navigation, header, and card rendering.
2. Search flow with debounced query execution and card filtering.
3. Adding content to favorites, verifying presence under `/favorites`, and removal.
4. Customizing preferences in `/settings` and dark/light mode toggle.

---

## 🎨 Design Decisions & Architecture Highlights

1. **Clean Redux State Separation**:
   - `preferencesSlice`: Handles persistent client customization (selected topics, dark mode, card ordering).
   - `favoritesSlice`: Handles bookmarks library with quick add/remove operations.
   - `RTK Query`: Handles server-side data caching, tag invalidation, and background synchronization without manual thunks.
2. **Server-Side API Security**:
   - External API keys are kept strictly in server-side Next.js route handlers (`/api/content` and `/api/trending`) and never exposed to the client bundle.
3. **Optimistic & Resilient UI**:
   - Skeleton screens avoid layout shifts during loading.
   - Broken image URLs fall back to category-themed visual badges instead of broken icons.
   - Keyboard accessible and WCAG compliant contrast ratios in both light and dark modes.

---

## 📄 License
MIT © 2026 PulseHub Team.
