#!/usr/bin/env node
/**
 * Update Contributor Graph avatars in README
 * - Finds the <details> with <summary>Contributor Graph</summary>
 * - Inserts/updates a row of clickable avatar images between markers
 *   <!-- CONTRIBUTORS:START --> ... <!-- CONTRIBUTORS:END -->
 * - Uses an image proxy to return pre-masked circular PNGs with a white border
 *   (works on GitHub README without relying on inline styles)
 */

const fs = require("fs");

// Node 20 has global fetch; fallback to node-fetch if needed
const _fetch = typeof fetch === "function" ? fetch : require("node-fetch");

// Env / defaults
const README_PATH = process.env.README_PATH || "README.md";
const DETAILS_SUMMARY_TEXT =
  process.env.DETAILS_SUMMARY_TEXT || "<summary>Contributor Graph</summary>";
const START = process.env.START_MARKER || "<!-- CONTRIBUTORS:START -->";
const END = process.env.END_MARKER || "<!-- CONTRIBUTORS:END -->";
const AVATAR_SIZE = parseInt(process.env.AVATAR_SIZE || "48", 10);
const MAX_CONTRIB = parseInt(process.env.MAX_CONTRIBUTORS || "200", 10);

// Circular mask/border settings (applied by proxy, not CSS)
const AVATAR_BORDER_COLOR = process.env.AVATAR_BORDER_COLOR || "white";
const AVATAR_BORDER_WIDTH = parseInt(
  process.env.AVATAR_BORDER_WIDTH || "2",
  10
);

// You can switch proxy if you prefer another service with mask support
const IMAGE_PROXY_BASE =
  process.env.IMAGE_PROXY_BASE || "https://images.weserv.nl/";

const REPO = process.env.GITHUB_REPOSITORY; // owner/repo

if (!REPO) {
  console.error("❌ GITHUB_REPOSITORY not set");
  process.exit(1);
}
if (!fs.existsSync(README_PATH)) {
  console.error(`❌ README not found at ${README_PATH}`);
  console.error("   Tip: ensure actions/checkout has pulled your README.");
  process.exit(1);
}

// GitHub REST helper (adds token if provided)
async function gh(url) {
  const headers = { Accept: "application/vnd.github+json" };
  const token = process.env.PERSONAL_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `token ${token}`;
  const res = await _fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${url}: ${body}`);
  }
  return res;
}
async function ghJSON(url) {
  const r = await gh(url);
  return r.json();
}

// Fetch contributors with pagination
async function getAllContributors(ownerRepo) {
  const per_page = 100;
  let page = 1;
  let list = [];
  while (true) {
    const batch = await ghJSON(
      `https://api.github.com/repos/${ownerRepo}/contributors?per_page=${per_page}&page=${page}`
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    list = list.concat(batch);
    if (batch.length < per_page || list.length >= MAX_CONTRIB) break;
    page += 1;
  }
  return list.slice(0, MAX_CONTRIB);
}

// Helper: strip scheme for images.weserv.nl (expects url param without protocol)
function stripScheme(u) {
  return u.replace(/^https?:\/\//i, "");
}

// Build a circular, bordered avatar URL via proxy.
// We ask GitHub for a 2x source (retina) and downscale to AVATAR_SIZE.
function circularAvatarURL(avatarBaseUrl, desiredSize) {
  const highRes = desiredSize * 2; // retina source for sharper downscale
  const sep = avatarBaseUrl.includes("?") ? "&" : "?";
  const src = `${avatarBaseUrl}${sep}s=${highRes}`;
  const srcNoScheme = stripScheme(src);
  // images.weserv.nl parameters:
  // - url=<host/path>
  // - w/h=<size>
  // - fit=cover (crop to square if needed)
  // - mask=circle (apply circular mask)
  // - border=<css color>  (e.g. white/#fff)
  // - borderwidth=<px>
  return (
    `${IMAGE_PROXY_BASE}?` +
    `url=${encodeURIComponent(srcNoScheme)}` +
    `&w=${desiredSize}&h=${desiredSize}` +
    `&fit=cover&mask=circle` +
    `&border=${encodeURIComponent(AVATAR_BORDER_COLOR)}` +
    `&borderwidth=${AVATAR_BORDER_WIDTH}`
  );
}

// Main
(async function main() {
  try {
    // 1) Get contributors; filter bots/admins; ensure unique by login
    let contributors = await getAllContributors(REPO);
    const seen = new Set();
    contributors = contributors.filter((c) => {
      const login = (c.login || "").toLowerCase();
      if (!login || seen.has(login)) return false;
      seen.add(login);
      const isBot =
        login.endsWith("[bot]") ||
        login.includes("-bot") ||
        c.type === "Bot" ||
        login.includes("dependabot");
      return !isBot && !c.site_admin;
    });

    // 2) Build avatars row (clickable)
    const avatars = contributors
      .map((c) => {
        const base = c.avatar_url || `https://github.com/${c.login}.png`;
        const avatarUrl = circularAvatarURL(base, AVATAR_SIZE);
        // No inline styles (GitHub sanitizes style=""); rely on pre-masked PNG.
        return `<a href="https://github.com/${c.login}" title="${c.login}"><img src="${avatarUrl}" alt="${c.login}" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}" /></a>`;
      })
      .join("");

    const avatarsBlock = [
      '<p align="left">',
      START,
      avatars || "<em>No contributors yet</em>",
      END,
      "</p>",
    ].join("\n");

    // 3) Read README and find the Contributor Graph <details> block
    let readme = fs.readFileSync(README_PATH, "utf8");

    const summaryIdx = readme.indexOf(DETAILS_SUMMARY_TEXT);
    if (summaryIdx === -1) {
      console.error(
        '❌ Could not find the "Contributor Graph" <summary> in README.'
      );
      process.exit(1);
    }

    const detailsOpenIdx = readme.lastIndexOf("<details", summaryIdx);
    const detailsCloseIdx = readme.indexOf("</details>", summaryIdx);
    if (detailsOpenIdx === -1 || detailsCloseIdx === -1) {
      console.error(
        "❌ Could not locate full <details> block for Contributor Graph."
      );
      process.exit(1);
    }

    const beforeDetails = readme.slice(0, detailsOpenIdx);
    const detailsBlock = readme.slice(
      detailsOpenIdx,
      detailsCloseIdx + "</details>".length
    );
    const afterDetails = readme.slice(detailsCloseIdx + "</details>".length);

    // 4) Insert/replace inside the details block, directly after the image </p>
    const imgParaCloseIdx = detailsBlock.indexOf("</p>");
    if (imgParaCloseIdx === -1) {
      console.error(
        "❌ Could not find closing </p> of the image paragraph in Contributor Graph."
      );
      process.exit(1);
    }

    const beforeImgPara = detailsBlock.slice(0, imgParaCloseIdx + 4);
    const afterImgPara = detailsBlock.slice(imgParaCloseIdx + 4);

    const startIdx = afterImgPara.indexOf(START);
    const endIdx = afterImgPara.indexOf(END);

    let newAfterImgPara;
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      // Replace existing block
      const pre = afterImgPara.slice(0, startIdx);
      const post = afterImgPara.slice(endIdx + END.length);
      newAfterImgPara = pre + avatarsBlock + post;
    } else {
      // Insert fresh block
      newAfterImgPara = "\n" + avatarsBlock + afterImgPara;
    }

    const newDetailsBlock = beforeImgPara + newAfterImgPara;
    const newReadme = beforeDetails + newDetailsBlock + afterDetails;

    if (newReadme === readme) {
      console.log("No changes to contributor avatars.");
      return;
    }

    fs.writeFileSync(README_PATH, newReadme, "utf8");
    console.log(
      "✅ Contributor avatars updated in README (circular, with white border)."
    );
  } catch (err) {
    console.error("❌ Failed:", err);
    process.exit(1);
  }
})();
