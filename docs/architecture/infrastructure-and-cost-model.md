# Infrastructure & Cost Model (Blocking — Brief §8)

**Date:** 2026-08-02 · **Status:** Proposed (must be accepted with ADR-0001 before backend build)
**Currency:** USD, monthly, 2026 list prices; estimates ±30%. GBP budget ceiling stated at the end.

## 1. Infrastructure choices (summary; reasoning in ADR-0001)

| Concern | Choice | Region |
|---|---|---|
| Web app hosting | Vercel (Next.js, edge) | Global edge, EU functions |
| Stateful services (realtime / api / ai) | Fly.io Machines (Docker) | **LHR primary**, EU secondary (§10 residency) |
| Primary DB + vector store | Neon Postgres 17 + pgvector | EU (Frankfurt/London) |
| Cache / pub-sub / queues / rate limits | Upstash Redis 7 | EU |
| Search | Postgres FTS (Meilisearch deferred) | — |
| Voice/video (elite §5.5.1, later track) | LiveKit Cloud | EU |
| Observability | Grafana Cloud + Sentry + Vercel Insights | EU stacks |
| CI/CD | GitHub Actions (existing `ci.yml` grows) | — |

## 2. The three cost drivers behave differently (§8.2)

1. **Persistent WebSocket connections** — cost is *capacity + egress*, driven by **peak concurrent**
   and session-hours, nearly flat per month once provisioned. Coalesced delta broadcasting (ADR
   Decision 3) caps egress at ~2–4 MB per participant-hour (5 Hz × ~100–200 B deltas) vs ~50 MB+
   naïve per-vote fan-out — a 10–20× structural saving.
2. **AI token spend** — cost is *per use*, driven by sessions that enable AI features, linear and
   unbounded **unless capped**. Controlled by: model routing (Haiku-class for volume work,
   Sonnet-class for generation), embedding/completion caching keyed by content hash (§6.3.1 —
   never regenerate unchanged work), auth-gating (§6.3.3), and a hard spend ceiling that halts
   generation and notifies (§6.3.2).
3. **Voice/video minutes** — cost is *per participant-minute*, an order of magnitude above both
   others when active. Therefore: separate later track, off by default, per-institution enablement
   with its own quota. Never bundled into base pricing assumptions.

## 3. Scenarios and expected monthly cost

Assumptions: avg session 50 min; participants hold 1 socket each; AI enabled on ~60% of sessions;
caching hit-rate 40% on generation, 80% on embeddings (re-runs of unchanged material are free).

**Scenario definitions**
- **Low** — pilot: 5 institutions, 60 sessions/mo, peak 200 concurrent, 2k MAU
- **Medium** — adoption: 25 institutions, 600 sessions/mo, peak 2,000 concurrent (largest single
  session 1,000), 25k MAU
- **High** — scale: 100 institutions, 3,000 sessions/mo, peak 10,000 concurrent (largest single
  session 3,000+ — the §5.5.10 target), 150k MAU

| Line item | Low | Medium | High |
|---|---:|---:|---:|
| Vercel (plan + usage) | $0 (Hobby) | $40 | $150 |
| Fly.io — realtime nodes (uWS, sharded by session) | $15 (2× shared-1x) | $90 (3× perf-1x) | $380 (4× perf-2x + LB) |
| Fly.io — api + ai-service + Jackson | $15 | $60 | $180 |
| Egress (coalesced deltas, ~$0.02/GB) | $2 | $25 | $120 |
| Neon Postgres (+pgvector) | $0 (free) | $69 | $300 |
| Upstash Redis | $0 (free) | $40 | $160 |
| Observability (Grafana + Sentry) | $0 (free tiers) | $55 | $180 |
| **Subtotal — platform & WebSocket capacity** | **$32** | **$379** | **$1,470** |
| AI — generation (Sonnet-class: question sets, insights, revision packs) | $25 | $260 | $1,100 |
| AI — volume tasks (Haiku-class: clustering, dedup, moderation, captions text) | $10 | $120 | $600 |
| AI — embeddings (voyage-lite; cached by content hash) | <$1 | $5 | $25 |
| **Subtotal — AI token spend** | **$36** | **$385** | **$1,725** |
| Voice/video (only if elite track enabled; LiveKit ~$0.36/participant-hr) | $0 | $0–$500 (opt-in pilots) | $0–$2,500 (quota-capped) |
| **Expected total (video off)** | **≈$68** | **≈$765** | **≈$3,200** |

Sanity ratios: platform cost per session-participant-hour falls from ~$0.019 (low) to ~$0.006
(high) — connection capacity amortises; AI cost per AI-enabled session stays ≈$0.55–0.65 —
per-use costs do not amortise, which is why the ceiling (below) targets the AI line first.

## 4. Budget ceiling & enforcement (§8.3, §6.3.2)

- **Operating ceiling: £3,000/mo (≈$3,800) absolute**, alertable thresholds at 50/75/90%.
- **AI spend ceiling: configurable global + per-institution + per-user; default global £1,500/mo.**
  Metered in `ai-service` (every call records tokens×price per feature, per tenant — §6.3.4).
  At 100%: generation **halts and notifies** (banner + email to admins); non-AI fallbacks (§6.2.9)
  keep every feature functional. No silent overspend, no silent degradation.
- **Connection capacity is pre-provisioned, not autoscaled-by-surprise**: scale-up is a deliberate
  (Terraform-reviewed) change when forecast peak > 70% of provisioned capacity; k6 load tests
  define what a node can actually hold.
- **Voice/video quota**: per-institution minute pools; hard stop + notification at quota.

## 5. Caching & scaling strategy that keeps cost bounded

- **Fan-out**: aggregate-then-broadcast (delta ticks), per-session sharding via consistent hash →
  one busy lecture cannot degrade others; `fly-replay` pins a session's sockets to its shard.
- **AI**: content-hash caching of embeddings and completions; batch clustering (windowed every
  2–5 s, not per response); prompt caching for the static instruction+material prefix (Anthropic
  prompt caching ≈90% input-token saving on repeated context); routing table sends nothing to a
  Sonnet-class model that a Haiku-class model scores acceptably on the eval set (§6.3.7).
- **DB**: hot path (response insert) is append-only + async aggregate materialisation; Neon
  autoscales compute down to ~zero off-hours (lecture-time load shape).
- **Static/media**: uploads to object storage (Tigris on Fly / Vercel Blob) behind CDN — never
  through app compute.

## 6. Review cadence

Re-forecast at each milestone gate against metered actuals (Grafana dashboard "Cost & Capacity");
any driver trending >20% above model triggers an ADR amendment, not an ad-hoc fix.
