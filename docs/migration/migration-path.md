# Migration Path — From "Plenary Chatroom" to the Educational Session Platform

**Date:** 2026-08-02 · **Basis:** `docs/audit/codebase-audit.md` · **Rule (Brief §2.4):** the
software remains working at every step; no big-bang rewrite. Pattern: **strangler fig** — the new
platform grows beside `Plenary Chatroom/`, absorbs its behaviour, and only then retires it.

Each phase ends in a releasable state with a named proof ("the app still works because…").
Phases map 1:1 to the GitHub milestones (M0–M8); issues carry the detail.

---

## Phase 0 — Stabilise the existing app (M0)
Make today's app honest before building beside it. No features.
- Fix the fresh-clone experience: commit `.env-cmdrc.example`, document real setup, remove dead
  `App.js` references and the dead `GET /login` stub; untrack `.DS_Store`.
- Close the two exploitable holes in place (parameterise the `getMessages` query; escape text
  before DOM insertion) — ~10 lines each, keeps the demo safe to run while it lives.
- Remove the silent fake-DB fallback (fail loudly instead of fabricating inserts — audit defect #5).
- Make CI real: root workspace so `npm ci`/`test` actually execute; MySQL service container for
  the existing Mocha suite.
- **Proof:** clean clone → `npm install` → `npm start` → two browsers chat across rooms; CI green
  running the real tests.

## Phase 1 — Monorepo scaffold around the legacy app (M1)
- pnpm + Turborepo workspace; `Plenary Chatroom/` becomes `apps/legacy-chat` untouched (path move
  only, start scripts preserved).
- New packages: `packages/schema` (Zod event/domain types — port of `MessageEvents.js`, its 11
  events become the first schema tests), `packages/ui` (design tokens extracted from `style.css`'s
  custom-property system, dark/light/high-contrast themes), `apps/web` (Next.js shell),
  `services/api`, `services/realtime` (skeletons).
- Terraform + Fly/Vercel/Neon/Upstash environments (dev/staging); Docker Compose local stack;
  CI matrix builds all workspaces; budgets wired (Lighthouse CI, bundle guard).
- **Proof:** legacy app still runs unchanged from the monorepo; `apps/web` deploys a branded
  placeholder consuming `packages/ui` tokens.

## Phase 2 — Realtime core + session model reach parity (M2)
- `services/realtime`: socket lifecycle, session join (code/link/QR), presence, rooms-scoped
  broadcast (fixing audit defect #4 by design), reconnect-with-outbox (§4.6), idempotent
  submissions; Postgres schema v1 (sessions, activities, participants, responses) via Drizzle.
- `apps/web`: participant join flow + live discussion & Q&A activity (upvote, moderate, mark
  answered) — the legacy behaviours, typed and secured.
- Legacy Mocha tests re-expressed as Vitest+Playwright specs against the new stack (behavioural
  parity gate); k6 baseline scenario committed and running nightly.
- **Proof (parity gate):** every behaviour the legacy app supports works in the new stack; the
  old integration suite's assertions all have passing equivalents.
- **Legacy retirement:** `apps/legacy-chat` archived to a tagged branch (`legacy-final`), README
  section preserved; it stops deploying but its history and brand continue.

## Phase 3 — Presenter experience + live activities (M3)
Polls (all §5.2.1 types), word clouds, quizzes with leaderboard, presenter console with projection
view, keyboard/command palette; results animation; anonymous vs identified modes per activity.
Releasable after each activity type — activities are vertical slices behind a registry.

## Phase 4 — AI cloud layer (M4)
`services/ai`: provider abstraction, routing policy, streaming with cancel, spend metering +
ceiling, moderation, prompt registry + eval CI; RAG ingestion (upload → chunk → embed → pgvector);
features land behind flags in this order: question generation → Q&A dedup/clustering →
summaries → insight reports (each with its non-AI fallback proven by turning the flag off).

## Phase 5 — PWA, offline, accessibility & performance hardening (M5)
Installable PWA (manifest + Serwist service worker), offline response outbox (§5.5.6), WCAG 2.2 AA
audit + fixes with screen-reader test passes, visual regression (Playwright) across the four
browsers + two mobile OSes, budgets enforced as release blockers (§7.9).

## Phase 6 — Analytics, reporting, LTI & institutional features (M6)
Post-session/cohort reports, CSV/XLSX/PDF export, attendance, LTI 1.3 tool (deep linking + grade
passback), institutional SSO (OIDC live, SAML via Jackson), RBAC (admin/presenter/moderator/
participant), UK-GDPR export/deletion, AI opt-out per institution.

## Phase 7 — Scale proof & security hardening (M7)
k6 to 3,000+ participants in one session with p95 < 500 ms propagation (release-blocking, §5.5.10);
realtime sharding + failover drills; threat model (STRIDE) documented; OWASP Top 10 + LLM Top 10
review; join-flood/code-guessing/vote-manipulation defences verified; external-style pen-test pass.

## Phase 8 — Native wrappers & distribution (M8, later track by design §4.5)
Tauri desktop (Win/macOS/Linux, signed installers, auto-update) and Capacitor iOS/Android wrapping
the same web app; platform secure storage (Keychain/Keystore) for tokens; store review runs off
the critical path — web/PWA users are never blocked by it. Elite additions (voice/video via
LiveKit, live captions/translation, recording timeline) proceed as capacity allows, each
flag-gated and quota-capped per the cost model.

---

## Invariants at every phase
1. `main` is always deployable; every phase gate has a demoable build.
2. The brand, README automation markers, licence, and community files persist.
3. No phase begins until its predecessor's proof is met (parity gate before legacy retirement;
   cost-model acceptance before backend build; load-test pass before scale claims).
4. Rollback = redeploy previous tag; schema migrations are forward-only with expand/contract
   (never break the running version).
