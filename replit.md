# SuuqLink

Polished, mobile-first marketplace web app for emerging markets. Buyers discover trusted vendors, browse products by category, search, chat with sellers, and check out with multiple payment methods. Sellers manage storefronts and admins see a live dashboard.

## Stack

- pnpm monorepo (`pnpm-workspace.yaml`)
- API: `artifacts/api-server` — Express 5 + Drizzle ORM (Postgres), zod-validated routes, auto-generated OpenAPI in `lib/api-spec`, generated React Query hooks in `lib/api-client-react`. Mounted at `/api`, port 8080.
- Web: `artifacts/suuqlink` — React 19 + Vite 7 + TypeScript + Tailwind v4 + framer-motion + recharts + wouter. Port 20065.
- Shared zod schemas: `lib/api-zod` (re-exports generated `./generated/api`).

## Brand & UX

- Teal primary (`174 72% 28%` light / `168 70% 48%` dark) + saffron/orange accent.
- Inter (body) + Plus Jakarta Sans (display).
- No emoji icons in the UI; lucide-react throughout.
- Mobile-first phone frame on most pages; admin uses a wide responsive layout.
- Light + dark themes via `next-themes`; theme toggle in top bar and account.
- Page transitions via framer-motion; subtle pulse, shimmer, and glass utilities in `index.css`.

## Demo session

Single demo session row in `session` table — no cookies needed. Login accepts any creds (defaults to buyer). Use the Account screen to switch personas (buyer / seller / admin). Seeded users:
- `amina@suuqlink.app` — buyer (Amina Yusuf)
- `hodan@suuqlink.app` — seller (Hodan Textiles)
- `admin@suuqlink.app` — admin

## Pages

- `/onboarding` — three-slide intro, gates the home route until completed.
- `/login`, `/register` — quick demo auth with role picker.
- `/` — home with hero, trust strip, category grid, trending row, featured grid, vendor spotlights.
- `/search` — debounced search with suggestions, category chips, sort options, filters.
- `/category/:slug` — category landing.
- `/vendors`, `/vendor/:id` — vendor list and storefront with rating, response time, fulfillment, products, chat-with-seller.
- `/product/:id` — gallery, badges, specs, reviews, related products, sticky add-to-cart with qty stepper, success toast.
- `/cart` — line-item editor, promo CTA, totals, checkout button.
- `/checkout` — three-step (address → payment → review). Payment options: mobile money, card, COD, bank transfer.
- `/orders`, `/orders/:id` — order list and tracker timeline.
- `/chat`, `/chat/:id` — conversation list and threaded chat with auto-reply.
- `/account` — persona switch, language, theme toggle, quick links, reset onboarding.
- `/admin` — KPI cards, revenue area chart, orders-by-status bar chart, top vendors/categories, recent activity, vendor health, recent orders.

## Key data flows

- React Query hooks under `@workspace/api-client-react`; pass `queryKey: getXxxQueryKey(...)` when overriding query options.
- Mutations invalidate using `getXxxQueryKey()` — see cart, checkout, chat, vendor pages for patterns.
- Cart and conversation badge counts power the bottom tab bar.

## Local dev

- API: `pnpm --filter @workspace/api-server run dev` (auto-started workflow).
- Web: `pnpm --filter @workspace/suuqlink run dev` (auto-started workflow).
- Typecheck: `pnpm --filter @workspace/suuqlink run typecheck`.
- DB push: `pnpm --filter @workspace/db run push`.
