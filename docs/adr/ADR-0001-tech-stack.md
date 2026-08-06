# ADR-0001 — Tech Stack for the Plenary Educational Session Platform

**Status:** Proposed
**Date:** 2026-08-02
**Deciders:** Muhammad Abdullah (owner); drafted by Claude Code
**Inputs:** `docs/audit/codebase-audit.md` (mandatory baseline), Project Brief §3, §7, §8
**Companions:** `docs/architecture/infrastructure-and-cost-model.md` (§8, blocking),
`docs/migration/migration-path.md` (§2.4)

## Context

The audit established: a working but unsalvageable Node/Express/`ws`/MySQL chat app whose *domain*
(rooms as lectures, live Q&A with answer-marking) and *brand* carry forward; a single maintainer;
no production data; no legacy compatibility constraints. Target: web/desktop/mobile parity from one
codebase (PWA first, store wrappers later — Brief §4.5), thousands of concurrent participants in
one session with sub-second result propagation (§5.5.10), deep LLM integration behind a cloud
service layer (§6), strong typing end-to-end, realistic running cost for a small team (§3.3).

Selection criteria applied to every decision, in priority order:
1. One shared codebase across platforms; 2. TypeScript end-to-end with shared schemas;
3. proven high-fan-out real-time capability; 4. small-team operability (managed > self-hosted when
cost-comparable); 5. bounded, modelled running cost; 6. mature ecosystem for LTI/SSO/accessibility.

---

## Decision 1 — Frontend framework & cross-platform strategy (§3.2.1)

**Chosen: Next.js 15 (React 19) + TypeScript, delivered as an installable PWA first; Tauri 2.x
desktop wrapper and Capacitor 7 mobile wrapper around the same web codebase in the later
distribution track.**

Reasoning:
- One React codebase satisfies §4.4 parity by construction: desktop and mobile are the *same*
  compiled web app in a native shell, not re-implementations. Platform divergence (§7.4) becomes
  structurally impossible rather than a QA burden.
- PWA-first (§4.5) removes app-store review from the critical path; Next.js has first-class
  service-worker (Serwist), manifest, and offline support needed for §4.6/§5.5.6.
- React has the strongest accessibility tooling (react-aria, Radix primitives, axe integration) —
  WCAG 2.2 AA (§7.8) is a hard requirement and the deepest ecosystem wins.
- Join-to-interactive < 2 s on 4G (§7.9): Next.js App Router server components keep the
  participant join path nearly JS-free; the participant bundle is budgeted separately (below).
- The audit's client is vanilla DOM with hand-rolled state; there is no framework investment to
  preserve, so the choice is unconstrained.

Rejected:
- **Flutter** — true parity but a second language (Dart), weak web accessibility (canvas renderer),
  poor PWA story, no reuse of the React/LTI/AI web ecosystem. Fails criteria 2 and 6.
- **React Native + react-native-web** — inverts the priority: our primary surface is the browser
  (§4.1 "join from a link in seconds"); RN-web adds a compatibility layer exactly where we need
  the platform to be most native. Store wrappers are a later, thin concern, not the core.
- **Electron (desktop)** — 150–250 MB installers and a bundled Chromium per app vs Tauri's ~10 MB
  using the OS webview. Tauri 2 also covers iOS/Android, giving an escape hatch if Capacitor
  disappoints.
- **SvelteKit/SolidStart** — genuinely smaller runtimes, but thinner a11y/component/LTI ecosystem
  and a smaller hiring/help pool; bundle budget is achievable with React via server components.

## Decision 2 — Backend language, framework & API style (§3.2.2)

**Chosen: TypeScript on Node.js 22 LTS everywhere, in a pnpm + Turborepo monorepo. API service
built with NestJS 11 (Fastify adapter). API style: REST with OpenAPI 3.1 (generated from Zod
schemas) for public/institutional surface + WebSocket event protocol for live traffic.**

Reasoning:
- One language across web, API, realtime, and AI services: shared `packages/schema` (Zod) is the
  typed, versioned descendant of the audit's `MessageEvents.js` — the same objects validate client
  input, server handlers, OpenAPI docs, and test fixtures. Criterion 2 satisfied end-to-end.
- NestJS provides the brief's §9 requirements out of the box: layered architecture, dependency
  injection, testing utilities, guards/interceptors for §10 authorisation — with Fastify for
  throughput.
- REST+OpenAPI (not tRPC/GraphQL) because the external integrations that matter — LTI 1.3 tool
  endpoints, institutional exports, webhooks — are REST-shaped, and OpenAPI gives us generated
  clients and contract tests. tRPC would couple institutional consumers to our TS toolchain.

Rejected:
- **Go / Elixir (Phoenix)** — Phoenix Channels are the gold standard for fan-out, but a second
  language for a single maintainer violates criterion 4; Node with uWebSockets.js demonstrably
  holds the §5.5.10 target (see Decision 3 and load-test plan).
- **GraphQL** — subscription complexity duplicates our WS layer; institutional consumers expect
  REST; N+1/complexity control is overhead we don't need.
- **tRPC-only** — excellent internally, wrong shape for LTI/institutional/public API. (We may still
  use tRPC *inside* the monorepo for presenter-console-only endpoints; that is an implementation
  detail, not the public contract.)

## Decision 3 — Real-time transport, presence, pub/sub, fan-out (§3.2.3)

**Chosen: a dedicated stateful `realtime` service — uWebSockets.js (via Socket.IO 4 with the
uWS engine + Redis Streams adapter) — horizontally sharded by session, with Redis 7 as
pub/sub backbone and presence store. Server-side aggregation with coalesced result broadcasting
(4–10 Hz deltas) as the core scaling pattern.**

Reasoning:
- The brief's hard number — thousands of concurrent participants in *one* session, sub-second
  propagation (§5.5.10) — is an *aggregation* problem more than a transport problem: 5,000 voters
  must not generate 5,000 × 5,000 messages. Responses flow up; the server folds them into activity
  state; only *coalesced deltas* (vote tallies, word-cloud top-N, leaderboard) fan out on a fixed
  tick. This pattern is transport-independent and is the design centre of the realtime service.
- uWebSockets.js holds 100k+ idle connections per node and ~10× `ws` throughput in public
  benchmarks; one mid-size node covers our high scenario, two give headroom + failover.
- Socket.IO on top provides rooms, auto-reconnect with buffered acks (§4.6 "lose no submitted
  responses" — client-side outbox + server idempotency keys complete it), heartbeats for presence,
  and fallback to HTTP long-polling for hostile campus networks/proxies.
- Redis provides cross-node pub/sub, presence sets, rate-limit counters, and the response
  idempotency cache with one operational dependency — already on the audit's own roadmap (Task 5).

Rejected:
- **Managed realtime (Ably/Pusher/PubNub)** — excellent SLAs, but at 3,000 concurrent × 1-hour
  daily sessions the message-volume pricing exceeds self-hosted cost by an order of magnitude
  (modelled in the cost doc), and per-message billing punishes exactly our burst pattern. Kept as
  a documented fallback if operating the service proves too heavy.
- **Cloudflare Durable Objects** — genuinely attractive (per-session actor model), but single-DO
  throughput caps force sub-sharding complexity right where we're weakest at debugging, and it
  splits the stack across a second cloud. Revisit at >10k-participant sessions.
- **Plain `ws` (status quo)** — the audit shows what that costs: hand-rolled rooms, no reconnect
  semantics, no backpressure. We keep the *event envelope* concept, not the library.
- **Server-Sent Events + POST** — viable for results-down/votes-up, but no binary, no
  multiplexing, and two code paths; WebSocket with long-poll fallback covers its advantages.

## Decision 4 — Primary database, cache, search (§3.2.4)

**Chosen: PostgreSQL 17 (managed: Neon) as the single source of truth; Drizzle ORM with
`drizzle-kit` migrations; Redis 7 (managed: Upstash) for cache/presence/rate-limits/queues
(BullMQ); search via Postgres FTS + pgvector now, Meilisearch deferred behind an interface.**

Reasoning:
- The audit freed us from MySQL (three tables, seed data only). Postgres wins on: `pgvector`
  (Decision 5 — vector store in the same engine), JSONB for flexible activity-response payloads,
  row-level security as defence-in-depth for institution multi-tenancy (§10 RBAC), and richer
  aggregate/window functions for analytics (§5.4.3).
- Managed serverless Postgres (Neon) matches the spiky lecture-hour load profile and criterion 4;
  branching gives per-PR preview databases for CI.
- Drizzle over Prisma: SQL-transparent (we will hand-tune the hot response-insert path),
  ~zero-cost runtime, native Zod integration (one schema source), first-class pgvector support.
- Search: course-material and Q&A search at our scale is well inside Postgres FTS + trigram
  territory; a dedicated engine is real operational weight. The repository interface isolates the
  decision so Meilisearch can be added when relevance tuning demands it.

Rejected: **MySQL** (no pgvector, weaker JSON/window functions; nothing to preserve),
**MongoDB** (our data is relational: sessions→activities→responses→participants; grade export
demands consistency), **Supabase-as-platform** (we want its Postgres without coupling auth/realtime
to it — our realtime layer is custom for aggregation reasons), **Elasticsearch** (cost/ops far
beyond need), **Redis-as-primary-store** (durability semantics wrong for grades/attendance).

## Decision 5 — LLM provider abstraction, vector store, embeddings (§3.2.5)

**Chosen: a dedicated `ai-service` in the monorepo owning all model I/O (client never holds keys,
§6.1.1), built on Vercel AI SDK 5 as the provider abstraction with a gateway for routing/failover.
Default models: Anthropic Claude — `claude-sonnet-5` for complex generation (question authoring
from slides, insight reports), `claude-haiku-4-5` for high-volume/low-latency tasks (thematic
clustering, dedup, moderation). Embeddings: `voyage-3.5-lite` primary. Vector store: pgvector
(HNSW) in the primary Postgres. Ingestion: chunk → embed → upsert pipeline as BullMQ jobs keyed by
content hash (re-index only changed chunks, §6.3.1).**

Reasoning:
- AI SDK gives us one typed interface (streaming, tool use, cancellation — §6.1.5) over every
  provider, so the §6.1.2 swap requirement is config, not code; a gateway layer adds routing
  policy, spend caps, failover to a secondary provider (§6.1.4), and per-feature token metering
  (§6.3.4) without building a proxy ourselves.
- Two-tier model routing (§6.1.3) is a *documented policy table* in `ai-service` config:
  task-class → model, overridable per institution. Cheap-fast tier handles the per-response volume
  work (clustering hundreds of free-text answers live); strong tier handles low-frequency,
  high-value generation.
- pgvector keeps RAG (§6.1.6) inside the transactional boundary: a session's material, its chunks,
  and its embeddings share foreign keys, RLS tenancy, and backups. At our corpus scale (course
  materials, not the open web) HNSW on Postgres is comfortably sub-100 ms.
- Prompt-injection defence (§6.3.5): participant text and retrieved chunks enter prompts only as
  fenced, role-separated *data* blocks with an instruction firewall; prompts are versioned files in
  `packages/prompts` with a regression eval set run in CI (§6.3.7).

Rejected: **LangChain** (abstraction tax, churn; AI SDK + plain TS is auditable),
**Pinecone/Qdrant/Weaviate** (second datastore + network hop + bill for a corpus that fits in
Postgres; interface isolates a future move), **self-hosted open-weights** (GPU ops for one
maintainer violates criterion 4; the provider abstraction keeps the door open),
**OpenAI-only direct** (single-provider lock-in violates §6.1.2/§6.1.4).

## Decision 6 — Authentication incl. institutional SSO (§3.2.6)

**Chosen: Better Auth (self-hosted, TS-native) as the identity core — email/passkey/OAuth,
sessions, org/tenant model, RBAC claims — plus its SSO plugin for per-institution OIDC; SAML 2.0
via BoxyHQ SAML Jackson bridging to OIDC when an institution demands it. LTI 1.3 (which is
OIDC-based) implemented in the API service against the same identity core. Guest participants:
signed anonymous session tokens (no account, §5.1.2), with genuine-anonymity guarantees documented
per §10.**

Reasoning:
- Institutional SSO is the deciding requirement. Better Auth keeps identity data in *our* Postgres
  (UK-GDPR data-residency story, §10), is TypeScript end-to-end, free at any MAU, and its
  org/tenant primitives map to institutions.
- SAML remains common in UK HE; Jackson converts SAML IdPs into OIDC clients so the app speaks
  one protocol internally.
- Guest flow must not touch the identity provider at all: join-by-code issues a scoped, signed
  participant token (JTI-tracked for §10 vote-manipulation defence) — anonymity by architecture,
  and AI features are gated to authenticated roles (§6.3.3) by claim.

Rejected: **Auth0/Clerk** (per-MAU pricing is hostile to thousands-of-guests education traffic
even with guests kept off-IdP; data residency and export less under our control),
**Keycloak** (does everything incl. SAML natively, but is a JVM service to babysit — revisit if
enterprise federation demands outgrow Jackson), **NextAuth/Auth.js** (fine OAuth client, weak
org/RBAC/SAML story for institutional needs).

## Decision 7 — Hosting, IaC, deployment model (§3.2.7)

**Chosen: Vercel for the Next.js app (preview deployments, edge network, analytics); Fly.io for
the stateful services (`realtime`, `api`, `ai-service` as Docker apps, UK/EU regions — LHR
primary); Neon Postgres (EU); Upstash Redis (EU). IaC: Terraform for Neon/Upstash/DNS + `fly.toml`
per service, all in-repo; deploys via GitHub Actions (the audit's CI grows into this). Docker
Compose mirrors the full stack locally.**

Reasoning:
- Persistent WebSockets don't belong on serverless; Fly gives us long-lived processes, LHR/EU
  placement for the §10 data-residency requirement, cheap horizontal scale for session-sharded
  realtime nodes, and painless Docker deploys for a single maintainer.
- Vercel is the natural Next.js home (this repo's tooling already assumes it) and keeps the
  participant join path on a global edge — the <2 s join budget (§7.9) is mostly network.
- Terraform-in-repo satisfies §3.2.7 IaC with the smallest surface that makes environments
  reproducible; we deliberately avoid Kubernetes (criterion 4) until scale forces it.

Rejected: **AWS/GCP raw** (maximum control, maximum ops; ECS/EKS + ALB + ElastiCache + RDS is a
platform team's diet), **all-Vercel** (no persistent sockets), **all-Fly incl. frontend** (loses
preview deployments and edge rendering that Vercel gives free), **Railway/Render** (comparable to
Fly; Fly chosen for region control and `fly-replay` session routing).

## Decision 8 — Observability, logging, error tracking (§3.2.8)

**Chosen: OpenTelemetry SDK in every service as the vendor-neutral spine → Grafana Cloud free tier
(Tempo traces, Loki logs, Mimir metrics + dashboards/alerts); Sentry (frontend + backend) for
error tracking, release health, and session replay on errors; Vercel Speed Insights/Analytics for
Core Web Vitals against the §7.9 budgets; k6 (with `xk6-websockets`) as the load-testing harness
proving §5.5.10, wired into CI as the realtime layer's definition of done (§9).**

Reasoning:
- OTel keeps us vendor-portable (criterion 5 for cost, §10 for log-content control); one
  correlation ID flows browser → API → realtime → AI calls, and AI token spend/latency become
  first-class OTel metrics per feature (§6.3.4).
- Structured JSON logging (pino) with a PII/prompt-content redaction layer at the logger boundary
  satisfies the §10 "no PII/secrets/prompt content in logs" rule by construction — the redactor is
  the only path to a transport.
- Sentry is the best-in-class error UX for a small team; free tier suffices through beta.

Rejected: **Datadog** (superb, priced for enterprises), **ELK self-hosted** (ops burden),
**console-only** (the audit shows where that leads — a 307-line `backend.log` of raw
`console.log(ws)` dumps).

---

## Version pins & budgets (§3.4)

All versions are pinned exactly in lockfiles (pnpm `save-exact`); ranges below are the *approved
majors* at adoption time. Renovate bot proposes upgrades; CI budget gates must pass for merge.

| Layer | Package(s) | Pin |
|---|---|---|
| Runtime | Node.js | 22 LTS (Volta-pinned) |
| Web | next 15.x, react 19.x, typescript 5.x | exact via lockfile |
| Wrappers | @tauri-apps/cli 2.x, @capacitor/core 7.x | exact |
| API | @nestjs/* 11.x (Fastify 5 adapter) | exact |
| Realtime | socket.io 4.x, uWebSockets.js (pinned commit), ioredis 5.x | exact |
| Data | drizzle-orm 0.4x, postgres 17, redis 7, pgvector 0.8 | exact |
| AI | ai (AI SDK) 5.x, @anthropic-ai/sdk latest, zod 4.x | exact |
| Auth | better-auth 1.x, @boxyhq/saml-jackson 1.x | exact |
| Quality | vitest 3.x, playwright 1.5x, k6 0.5x, eslint 9.x, pino 9.x | exact |

**Performance & bundle budgets (enforced in CI, fail the build when exceeded — §7.9):**
- Participant join route: ≤ 150 KB gzipped JS, LCP < 2.5 s and join-to-interactive < 2 s on
  emulated mid-range mobile / 4G (Lighthouse CI, throttled).
- Presenter console: ≤ 300 KB gzipped JS initial, code-split per activity type.
- Lighthouse ≥ 95 all categories on participant + presenter routes; CLS < 0.1; INP < 200 ms
  (Speed Insights field data reviewed per release).
- Realtime: p95 response-submit→presenter-visible < 500 ms at 3,000 simulated participants
  (k6 scenario in CI nightly; release-blocking).

## Consequences

- Positive: one language, one schema source, parity by construction, every §3.3 criterion
  addressed with a modelled cost (see companion doc), no component with enterprise-scale ops.
- Negative / accepted risks: Node realtime is not Erlang — we mitigate with the aggregation
  pattern, sharding, and load tests rather than runtime magic; three managed vendors (Vercel,
  Fly, Neon/Upstash) means three bills and three status pages; Better Auth is younger than
  Keycloak — mitigated by keeping identity data in our Postgres (exit is a data-preserving swap).
- The **infrastructure & cost model** (`docs/architecture/infrastructure-and-cost-model.md`) is
  blocking per Brief §8: backend build does not start until it is accepted alongside this ADR.
