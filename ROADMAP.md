# Roova — MVP Roadmap

Where things stand: **roova-web** (this repo) has a fully built marketing site, auth UI, agency dashboard, admin dashboard, and marketplace — all running on simulated data (in-memory mocks, fake network delays, no real backend calls). **roova-backend** has a NestJS app with session-cookie auth for three roles (Agency/Admin/Investor) that was just built against Prisma + PostgreSQL, but the project is now **switching to MongoDB** — so that data layer needs to be re-platformed before anything else backend-related continues.

There is currently no investor-facing product surface at all (no portfolio, no invest flow, no secondary market UI) — only agency and admin dashboards exist. That's the single biggest gap between what's built and an actual MVP, since investing is the core product.

Tasks are grouped into phases in rough dependency order. Within each phase, `**MVP**` marks what's actually required to launch a minimal working product; everything else is valuable but deferrable past MVP.

---

## Phase 0 — Re-platform the backend to MongoDB

- [x] **MVP** Decide the ODM: Mongoose (via `@nestjs/mongoose`) is the standard NestJS pairing and has full MongoDB feature support; Prisma's MongoDB connector is comparatively limited (no migrations, weaker relation modeling) — recommend Mongoose unless there's a reason to stay on Prisma.
- [x] **MVP** Rewrite `Agency` / `Admin` / `Investor` as Mongo schemas (Mongoose schemas or Prisma Mongo models), including the unique-email constraint and the password-reset-token-hash lookup (Mongo needs an explicit unique index, same as the Postgres `@unique`).
- [x] **MVP** Swap `PrismaService` for a Mongo connection module; re-point `AgencyAuthService` / `AdminAuthService` / `InvestorAuthService` at the new data access layer (the service method *signatures* stay the same — only the persistence calls change).
- [x] **MVP** Re-verify all 17 auth endpoints against the new DB (the Postman/Hoppscotch collection at `roova-backend.postman_collection.json` already covers every success/error case — rerun it once Mongo is live).
- [x] Remove the now-unused Prisma/Postgres packages (`@prisma/client`, `prisma`, `@prisma/adapter-pg`, `pg`) and the `prisma/` directory once migration is confirmed working, so the repo doesn't carry two competing DB setups.
- [x] Update `.env.example` (`DATABASE_URL` → Mongo connection string format) and `prisma/seed.ts` → an equivalent Mongo seed script for the initial admin account.
- [x] Set up local MongoDB for dev (either local `mongod` or a free MongoDB Atlas cluster) and a separate Atlas project/cluster for production. *(Local `mongod` confirmed running; production Atlas cluster still pending — tracked in Phase 6.)*

---

## Phase 1 — Backend core domain (beyond auth)

Everything here is net-new backend work; only auth exists today.

- [x] **MVP** `Property` model + endpoints — agencies create/list/view listings, admin approve/reject, public browse. *(Note: `features/admin` and `features/marketplace` didn't actually exist in the frontend checkout when this was built — only `features/agency`'s schema was real. Property was designed as a superset of that real contract, adding `PENDING_REVIEW`/`REJECTED`/`CLOSED_UNFUNDED` states the frontend doesn't have yet. Phase 3 needs to catch the frontend up.)*
- [x] **MVP** `Investment`/`Share` model — the core transaction: an investor buying shares in a property. Tracks ownership, raised-amount, percent-funded; funding cap enforced via an atomic conditional `findOneAndUpdate` (no oversell possible, verified under a same-property double-buy race).
- [x] **MVP** Refund logic — lazy expiry check (no cron) flips an unfunded property to `CLOSED_UNFUNDED` and cascades its investments to `REFUNDED` on next read/write. Status-transition only — no real money moves yet since no wallet/ledger exists until Phase 2.
- [x] **MVP** `MarketplaceListing` + `PurchaseOffer` models — direct-sale houses with payment plans (full or installment, with down-payment % and duration options), buyer offers requiring Investor login, agency accept/reject with sibling-offer cascade.
- [ ] Dividend/payout model — quarterly rental income distribution to shareholders, and the agency commission payout tied to it (the frontend's Earnings/Transactions pages already assume this data shape).
- [ ] Secondary-market trade model — investors listing and buying shares from each other post-funding (the frontend's marketing copy promises this; no backend model exists yet).
- [ ] Notification model + delivery — replace the frontend's mocked notifications with real backend-generated events (new investor, funding milestone, KYC flag, agency application, etc.) for all three roles.
- [ ] KYC status workflow — investor uploads ID/proof of address, admin reviews and sets `kycStatus` (verified/pending/rejected). Needs a document-upload endpoint.
- [ ] File/image upload + storage — property photos and KYC documents need real object storage (S3, Cloudflare R2, or Cloudinary) since nothing is wired up yet; the frontend currently uses hardcoded Unsplash URLs as placeholders.

---

## Phase 2 — Payments & money movement

- [x] **MVP** Naira payment collection — Paystack integration (deposits go through the gateway; share purchases draw from the resulting wallet balance rather than a second gateway call per investment — see wallet/ledger note below). Verified against the real Paystack sandbox, including a genuine completed test-card charge (not just a simulated webhook).
- [x] **MVP** Wallet/ledger system — investor balance, transaction history, and escrow of invested funds until a funding round closes (or gets refunded). Wallet-first model: deposit → available balance → invest escrows into `escrowed` → refund reverses the escrow internally (no second Paystack call). Ledger rows double as an idempotency guard (unique-indexed per deposit/investment) so webhook retries and concurrent requests can't double-credit or double-escrow.
- [ ] Diaspora payment rails — card payments (Stripe) and/or USDC, plus real currency conversion (the homepage's "currency converter" is currently a cosmetic-only widget with hardcoded rates — needs a real FX rate source).
- [ ] Agency payout automation — bank transfer disbursement or, at minimum, admin tooling to mark payouts as sent and record them. *(Not started: escrowed funds for `FUNDED` properties currently sit in escrow indefinitely — this is the next piece needed to actually pay agencies out.)*
- [x] Reconciliation & audit trail — largely satisfied as a byproduct of the ledger design (every balance change is a traceable `WalletTransaction` row with before/after balances and a link back to its Deposit or Investment); no dedicated reconciliation tooling/dashboard was built beyond that.

---

## Phase 3 — Frontend ↔ backend integration

- [ ] **MVP** Replace every simulated `api.ts` in roova-web (`features/agency`, `features/admin`, `features/marketplace`, `features/auth`) with real `fetch` calls to roova-backend, keeping the existing TanStack Query hook signatures so components don't need to change.
- [ ] **MVP** Real auth gating — the agency and admin dashboards currently have *no* auth check at all (by deliberate earlier scope choice, since there was no backend yet); once real sessions exist, add middleware/layout-level checks that redirect unauthenticated users to login instead of rendering the dashboard directly.
- [ ] **MVP** Wire the session cookie flow across the real deployed subdomains (`roova.xyz` / `agency.roova.xyz` / `admin.roova.xyz`) — this was designed for and tested locally via `*.localhost`, but cross-subdomain cookies behave differently under real HTTPS/production `Domain=` attributes and need a live-environment pass.
- [ ] Real loading/error states sized for actual network latency and real failure modes (timeouts, 500s, offline) — today's "loading states" are calibrated to fixed fake delays.
- [ ] Environment configuration — API base URL per environment (local/staging/prod), secrets never committed (`NEXT_PUBLIC_*` vars already established for the subdomain URLs; extend the pattern for the API URL).

---

## Phase 4 — Investor portal (net-new frontend surface)

There is currently no investor-facing dashboard anywhere in the frontend — investors only exist as records inside the agency/admin views. This is the biggest product gap.

- [ ] **MVP** Investor login/signup destination — the main site's auth pages exist and work, but currently redirect to the *agency* dashboard on success for everyone; needs role-aware redirect once real accounts have a role.
- [ ] **MVP** Portfolio view — shares owned, current value, dividend history.
- [ ] **MVP** Browse + invest flow — pick a property, choose share count, pay (ties into Phase 2 payments).
- [ ] KYC upload flow (ties into Phase 1).
- [ ] Secondary market trading UI — list shares for sale, browse/buy others' listings.
- [ ] Marketplace purchase tracking — investors who submitted a `PurchaseOffer` (Phase 1) should be able to see its status somewhere, rather than it only being visible to the agency.

---

## Phase 5 — Compliance & security

- [ ] **MVP** Real SEC Nigeria registration and legal review of the Terms/Privacy/Risk Disclosure copy (currently placeholder text written for the demo — needs actual legal sign-off before real money moves).
- [ ] **MVP** KYC/AML provider integration (e.g., Smile Identity, Youverify) rather than manual admin review alone.
- [ ] **MVP** Rate limiting and brute-force protection on auth endpoints (login, forgot-password) — none exists yet.
- [ ] Production session hardening — secure/HTTPS-only cookies, a real rotated `SESSION_SECRET`, `helmet` security headers.
- [ ] Input sanitization audit beyond `class-validator` DTOs (e.g., NoSQL-injection considerations now that Mongo is in play).
- [ ] Data handling practices actually matching what the Privacy Policy page promises.

---

## Phase 6 — Infra & deployment

- [ ] **MVP** MongoDB Atlas production cluster (or equivalent managed hosting).
- [ ] **MVP** Backend hosting + CI/CD (Render, Fly.io, Railway, or AWS) — nothing is deployed yet, only running locally.
- [ ] **MVP** DNS finalization for `roova.xyz` + `agency.` / `admin.` subdomains (frontend Vercel side already documented in-repo; still needs an `api.roova.xyz` or similar for the backend) and the Vercel domain configuration itself.
- [ ] Secrets management on the hosting platform (never rely on committed `.env` files in prod).
- [ ] Error tracking/monitoring (Sentry or similar) and centralized logging.
- [ ] Database backup strategy.

---

## Phase 7 — Testing & QA

- [ ] **MVP** Backend unit tests for auth and investment/payment logic (money-handling code especially needs coverage before real funds move).
- [ ] **MVP** End-to-end tests for the critical path: register → KYC → invest → dividend, and agency submits listing → admin approves → goes live → investor invests.
- [ ] Frontend E2E tests (Playwright) against the real integrated backend, not just the current mocked data.
- [ ] Load testing before public launch.

---

## Phase 8 — Launch readiness

- [ ] **MVP** Real transactional email (replace the backend's current console-log `MailService` stub with SendGrid/Postmark/SES) plus SPF/DKIM/DMARC setup for `roova.xyz` so password-reset and notification emails actually land.
- [ ] Support pipeline — the Help Centre page is static FAQ content today; decide if launch needs a real ticketing/contact intake (email is already wired on the Contact page's simulated form).
- [ ] Product analytics and marketing attribution.
- [ ] Admin operational runbooks — concrete guidelines for what admin actually checks before approving an agency or a listing (today it's a single "Approve" button with no checklist behind it).

---

## Suggested next step

Phase 0 (Mongo re-platform) blocks everything else backend-related, and Phase 1 (core domain models) blocks both Phase 2 (payments) and Phase 4 (investor portal) — those three are the critical path to a working MVP. Marketing site, agency dashboard, and admin dashboard UI are already done; the work from here is overwhelmingly backend + the missing investor portal.
