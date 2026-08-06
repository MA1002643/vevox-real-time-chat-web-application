# Codebase Audit — Plenary Real-Time Chat Web Application

**Date:** 2026-08-02
**Auditor:** Automated audit (Claude Code), every tracked file read in full
**Repo state at audit:** branch `main`, commit `35a45c8`, 110 commits, single contributor (MA1002643), 35 tracked files
**Naming note (2026-08-02, revised):** this audit was carried out while the project still bore its
original name, *Vevox*; immediately afterwards it was renamed **Plenary** (repo slug `plenary`) to
establish its own identity, and this document has since been updated to the current name
throughout. Any remaining mention of "Vevox" below refers **only** to the commercial comparator
product, never to this project. The legacy directory has been renamed `Plenary Chatroom/`;
migration Phase 1 still moves it to `apps/legacy-chat`.
**Purpose:** Baseline required by Project Brief §2 before any architecture work. All subsequent
decisions (ADR-0001, infrastructure/cost model, migration path, project board issues) reference this
document.

---

## 1. What the software does today

A small full-stack chatroom application, built as an academic exploration of real-time systems and
inspired by Vevox/Slack. Runtime behaviour, verified by reading the code (not just the README):

1. Three Node.js servers start from one entrypoint (`Plenary Chatroom/index.js`):
   - **Express app on :3000** — a single stub route `GET /login` that reads `name`, `roomId`,
     `password` from the request *body* (invalid for GET), performs no validation, and returns
     nothing useful. Dead scaffolding.
   - **Static HTML server on :8080** (`htmlServer.js`) — second Express instance serving `html/`.
   - **WebSocket server on :8000** (`webSocketServer.js`, `ws` library) — the real application.
2. A participant opens `Index.html`, "logs in" via a **client-side-only fake check that always
   passes** (the real credential check is commented out), and lands on `Chatroom.html`.
3. The client (`clientSide.js`) connects to `ws://localhost:8000` (hardcoded), receives a
   `Connection Ready` event, requests the room list, and renders rooms named like *"Lecture 1"*,
   *"Lecture 2"* — the educational-session intent is already present in the seed data.
4. Selecting a room loads its message history. Users send **messages** or **questions** (a message
   with a title and answer status), **reply** to questions, and a reply can be **marked as the
   answer**, which broadcasts a state update to all clients. This is a primitive live Q&A feature —
   the seed of the target product's §5.2.3.
5. Messages persist to **MySQL** (`mysql2/promise`), with a silent fallback to a fake in-memory
   stub if the DB connection fails.
6. On socket close the client auto-reconnects every 1 s (crude but present — the seed of §4.6).

### Data handled today

| Table | Columns | Notes |
|---|---|---|
| `Room` | `roomId` (PK, int), `password` (nullable — **never checked anywhere**), `roomName` | Rooms are pre-seeded; no create-room path |
| `Message` | `messageId` (PK, auto-inc), `replyMessageId` (self-FK), `roomId` (FK), `message` (varchar 255) | No author, no timestamp — all messages are effectively anonymous and unordered |
| `Questions` | `questionId` (PK = `Message.messageId`), `Title`, `answerStatus`, `answerMessageID` (FK) | 1:1 extension of Message |

No user table, no PII stored. The login form collects a name that is never transmitted or persisted
(`Client.name` is always `null` server-side). Sessions are an in-memory dict keyed by UUIDv4,
lost on restart.

### Design language today

- **Dark theme by default with a light-theme toggle** (`body.active` swaps a block of CSS custom
  properties) — a genuine, working token-based theming mechanism in miniature.
- All colours defined as **CSS custom properties in `:root`** (~20 tokens), heavy multi-stop
  gradients (`#1a2a6c→#b21f1f→#fdbb2d`, `#004e92→#000428`, etc.), rounded chat bubbles with
  directional corner radii, bold text.
- Fonts: "Zen Tokyo Zoo" (display), Nunito declared then **overridden by Courier New** in the same
  `*` rule — an unintentional monospace body.
- Layout: absolute positioning + one 700 px mobile breakpoint with a hamburger menu.
- A second, unwired redesign prototype lives in `example chatroom html & styling/`
  (cleaner flex-column layout, 255-char-limited textarea).

---

## 2. Complete inventory

### 2.1 Application code (`Plenary Chatroom/`)

| File | Role | Assessment |
|---|---|---|
| `index.js` (24 lines) | Entrypoint; Express on :3000 with dead `/login` stub; requires the other two servers for side effects | **Replace** |
| `htmlServer.js` (11 lines) | Static file server on :8080 (`HTML_PORT` env override) | **Replace** (any framework serves static assets) |
| `webSocketServer.js` (264 lines) | WS server: session dict, 5 event types (`message`, `getMessages`, `markAnswerQuestion`, `createQuestion`, `getAllRooms`), MySQL access, fake-DB fallback | **Replace**, but its event-envelope pattern (`{eventType, event}`) and Q&A domain model carry forward as the protocol's ancestor |
| `html/MessageEvents.js` (130 lines) | 11 event classes shared between client and server via a try/catch dual-environment export | **Keep the idea, replace the implementation** — this is exactly what a shared typed-schema package (Zod/TypeScript) formalises |
| `html/clientSide.js` (230 lines) | WS client: reconnect loop, event dispatch, DOM rendering via string-concatenated `innerHTML` | **Replace** (XSS-unsafe rendering; logic ports to typed client) |
| `html/Index.html` (81 lines) | Login/landing page; fake auth; references missing `App.js` | **Replace** |
| `html/Chatroom.html` (110 lines) | Chat UI; room sidebar, message list, question/message category picker; references missing `App.js` | **Replace** (information architecture carries forward) |
| `html/style.css` (684 lines) | Token-based dual-theme stylesheet, gradients, chat bubbles, 700 px breakpoint | **Refactor into design tokens** — palette and dark/light mechanism are the brand seed |
| `html/Send.png` | Send-button icon | **Keep** (asset library) |
| `example chatroom html & styling/newChatroom.html` + `newStyle.css` (147 lines) | Unwired UI redesign prototype | **Archive** (documented intent, not wired) |
| `Migrations/1-AddRoomName.sql`, `2-AddQuestions.sql` | Hand-run migration files, no runner, not idempotent | **Replace** with a real migration tool; history preserved |
| `test/serverSide.js` (285 lines) | 8 Mocha integration tests against a live WS server + seeded DB | **Keep as behavioural spec**, replace harness (tests are order-dependent, require live infra, share global sockets) |
| `test/database.sql` | Schema + seed data (negative IDs for fixtures) | **Keep as schema documentation** during migration |
| `package.json` / `package-lock.json` | deps: express 4.17.3, ws 8.5.0, mysql2 2.3.3, uuid 8.3.2, mocha 9.2.2 (misfiled as prod dep), env-cmd 10.1.0 | **Replace**; `env-cmd` expects an `.env-cmdrc` that is gitignored → `npm start` fails on fresh clone |
| `backend.log`, `ca.pem`, `.DS_Store` (untracked) | Local artifacts; `ca.pem` is a self-signed "Internet Widgits" test CA, not a leaked secret | Local only — no action beyond keeping `.gitignore` rules |

### 2.2 Repository/meta files (root and `.github/`)

| File | Assessment |
|---|---|
| `README.md` (407 lines) | **Keep and evolve.** Rich, branded (💬 PLENARY identity, badges, auto-updated sections). Its Roadmap (JWT auth, presence, uploads, Redis pub/sub, migrations tooling, rate limiting, E2E tests, PWA, Docker/CI-CD) independently anticipates much of the project brief — cite it as continuity |
| `LICENSE` (MIT) | **Keep** (note: inner `package.json` says UNLICENSED — inconsistency to fix) |
| `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md` | **Keep**; SECURITY.md needs one fix — it invites *public issues* for vulnerability reports, contradicting its own advisory option |
| `.github/workflows/ci.yml` | **Keep and extend** — Node 20, `npm ci`, lint/test with `--if-present` (currently vacuous: no lint configured, tests need live MySQL, and there is no root package.json so CI passes trivially) |
| 4 × `update-*.yml` workflows + `scripts/update-contributors.js` | **Keep** — README automation (project index, contributors, tech badges, structure) is working repo infrastructure |
| Issue templates (bug/feature/config), PR template, CODEOWNERS | **Keep** |
| `.gitignore` | **Keep** — thorough (envs, certs, logs, DBs). One violation: `.DS_Store` rule exists but a `.DS_Store` is already tracked — remove from index |

---

## 3. Defect register (informs security & migration issues)

Severity-ordered; each becomes or informs a tracked issue.

1. **SQL injection** — `getMessages` concatenates `roomId` directly into the query string
   (`webSocketServer.js:119`). Every other query is parameterised; this one is exploitable by any
   connected client.
2. **Stored XSS** — all message/question/reply rendering is string-concatenated `innerHTML`
   (`clientSide.js` `createMessage`/`createQuestion`/`createReply`). Any participant can inject
   script into every other participant's browser.
3. **No authentication or authorisation** — login is client-side theatre; the WS server accepts any
   connection; `Room.password` is never checked; `ClientState.Authenticated` is never set.
4. **Broadcasts ignore rooms** — `notifyClientsOfNewMessage` and `markAnswerQuestion` send to
   *every* connected client regardless of room; clients happily render them. Cross-room data leak
   and O(total-clients) fan-out.
5. **Silent fake-DB fallback** — on DB failure the server fabricates insert IDs
   (`Math.floor(Math.random()*100000)`) and returns empty reads while appearing healthy. Data loss
   presented as success.
6. **Implicit globals & latent bugs** — `webSocketSessions`, `webSocketServer`, `connection`,
   `result`, `rows` are undeclared globals (race-prone across concurrent messages);
   `notifyClientsOfNewMessage` reads global `result` instead of its parameter; duplicate
   `createQuestion` case (second is dead); `throw new Exception("test")` would itself throw
   `ReferenceError`; `questionAnswerMessageIds` is an array mutated with `+=` (string concat) then
   queried with `.includes` (substring false-positives).
7. **No transport security, validation, or rate limiting** — plaintext `ws://`, no message-size or
   frequency limits (255-char cap exists only in the unwired prototype), no schema validation
   beyond `JSON.parse`.
8. **Broken fresh-clone experience** — `npm start` requires a missing `.env-cmdrc`; `App.js` is
   referenced by both pages but does not exist; README screenshots point to a missing
   `screenshots/` directory; three fixed ports are hardcoded.
9. **Test fragility** — integration tests depend on execution order, a live seeded MySQL, fixed
   ports, and leak sockets (`--exit` masks it); CI never actually runs them.

---

## 4. Keep / Refactor / Replace — summary with reasoning

**Keep (build upon):**
- **Brand & identity**: the 💬 identity, README structure/automation, MIT licence — carried
  forward under the new name **Plenary** (the "Vevox" name itself was retired at rename: it
  collides with the commercial comparator's trademark) — plus,
  community-health files, issue/PR templates, CI skeleton.
- **Domain model as the seed**: Rooms→Sessions, Messages→Discussion, Questions with
  answered-status→Q&A activity. The target product is a superset; no conceptual reset.
- **The dark/light token mechanism and palette** as input to the design-token system (§7.2).
- **Integration tests as executable behavioural spec** for the protocol they cover.
- **Working ideas to formalise**: shared client/server event schema (`MessageEvents.js`),
  auto-reconnect loop, event-envelope protocol, optimistic own-message rendering
  (`isOwnMessage`), migrations-as-files.

**Refactor (carry forward, restructure):**
- Event protocol → versioned, Zod-validated, TypeScript-typed shared package.
- SQL schema → normalised session/activity/response model in a managed-migration tool, with the
  current three tables mapped 1:1 into it (data migration is trivial: no users, no PII).
- `style.css` custom properties → design tokens consumed by the component library.
- CI workflow → real lint/typecheck/test/build pipeline with services (DB) and budgets.

**Replace (with reasoning):**
- All three servers: architecture (implicit globals, one shared DB connection, no rooms scoping,
  no auth seam) cannot be incrementally hardened to thousands of concurrent participants (§5.5.10);
  strong typing end-to-end (§3.3) requires TypeScript throughout anyway.
- All client code: `innerHTML` rendering is unsalvageable (XSS), there is no component or state
  model, and platform requirements (PWA, offline queue, parity across web/desktop/mobile) demand a
  component framework.
- Dependency set: express 4.17.3 (2022), ws 8.5.0, mysql2 2.3.3 all carry known CVEs fixed in later
  versions; none survive into the target stack unpinned.

**No big-bang rewrite:** the existing app keeps running throughout — see
`docs/migration/migration-path.md` for the staged path (strangler pattern: new platform grows
beside `Plenary Chatroom/`, which is retired only when the new stack reaches feature parity with
these ~5 events).

---

## 5. Constraints this audit imposes on the architecture

1. **Single maintainer, academic origin** → the ADR must optimise for a small team: managed
   services over self-operated infrastructure wherever cost allows (§3.3).
2. **No existing users or data worth migrating** → schema freedom is total; "preserve working
   functionality" means preserving *capability* (live Q&A over WebSockets) and *brand*, not wire
   or schema compatibility.
3. **Existing repo automation writes to README** → keep marker blocks (`TECH-STACK`,
   `CONTRIBUTORS`, project index) intact when restructuring the repo, or the bots will fight us.
4. **The GET-with-body `/login`, fake DB fallback, and always-true login are traps** — nothing may
   silently depend on them; migration Phase 0 removes the fake-success paths first.
5. **MySQL is not load-bearing** → the primary-database decision in ADR-0001 is unconstrained by
   legacy (three tables, seed data only).
