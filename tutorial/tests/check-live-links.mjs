/**
 * Live-Link-Checker fuer die Tutorial-Seite (Docsify auf GitHub Pages).
 *
 * Was es tut:
 *   - laedt die Seite mit Playwright
 *   - BFS durch alle Hash-Routen, denen ein <a href="#/..."> entspricht
 *   - lauscht auf jede Network-Response: jeder .md/.pdf/.png/... der nicht 200
 *     liefert wird gemeldet, samt der Route, von der aus er angefordert wurde
 *   - meldet zusaetzlich Routen, deren gerenderter Content "404" / "Not Found"
 *     enthaelt (Docsify zeigt das, wenn notFoundPage greift)
 *
 * Was es NICHT tut:
 *   - keine externen URLs (http(s)://andere-domain) verfolgen
 *   - keine HTML-Links wie <a href="slides/foo.pdf"> im neuen Tab oeffnen
 *     (die werden ueber den .md-Fetch implizit mitgeprueft, sobald die Route
 *     besucht ist)
 *
 * Voraussetzungen:
 *   npm install -g playwright
 *   npx playwright install chromium
 *
 * Aufruf:
 *   node tutorial/tests/check-live-links.mjs
 *   node tutorial/tests/check-live-links.mjs https://example.org/legal-history-hub/tutorial/
 */

import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const npmRoot = spawnSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["root", "-g"],
  { encoding: "utf8", shell: process.platform === "win32" }
).stdout.trim();
const { chromium } = require(join(npmRoot, "playwright"));

const DEFAULT_BASE =
  "https://digitalhumanitiescraft.github.io/legal-history-hub/tutorial/";
const BASE = (process.argv[2] || DEFAULT_BASE).replace(/\/?$/, "/");

const ASSET_RE = /\.(md|pdf|png|jpe?g|gif|svg|css|js|json|csv|zip|docx|xlsx)(\?|$)/i;

function normalizeRoute(href) {
  if (!href) return null;
  if (!href.startsWith("#/")) return null;
  return href.split("?")[0].replace(/\/+$/, "") || "#/";
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const failed = []; // { url, status, fromRoute }
  const visited = new Set();
  const queue = ["#/"];
  let currentRoute = null;

  page.on("response", (resp) => {
    const url = resp.url();
    if (!ASSET_RE.test(url)) return;
    if (resp.status() >= 400) {
      failed.push({ url, status: resp.status(), fromRoute: currentRoute });
    }
  });

  console.log(`Live-Link-Check: ${BASE}`);
  console.log("=".repeat(60));

  const notFoundRoutes = []; // { route, marker }

  while (queue.length) {
    const route = queue.shift();
    if (visited.has(route)) continue;
    visited.add(route);
    currentRoute = route;

    const target = BASE + route;
    try {
      await page.goto(target, { waitUntil: "load", timeout: 20000 });
      // Docsify rendert nach Load asynchron. Warten bis .markdown-section
      // gefuellt ist oder Timeout.
      await page
        .waitForFunction(
          () => {
            const el = document.querySelector(".markdown-section");
            return el && el.innerText.trim().length > 0;
          },
          { timeout: 8000 }
        )
        .catch(() => {});
      // Kleiner Puffer fuer Lazy-Loads
      await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    } catch (e) {
      failed.push({ url: target, status: "nav-error: " + e.message, fromRoute: route });
      continue;
    }

    // Docsify-NotFound erkennen
    const bodyText = await page.evaluate(() => {
      const el = document.querySelector(".markdown-section");
      return el ? el.innerText.slice(0, 500) : "";
    });
    if (/^\s*(404|Not Found|Couldn['’]t find)/i.test(bodyText.trim())) {
      notFoundRoutes.push({ route, marker: bodyText.trim().slice(0, 120) });
    }

    // Alle <a href> der gerenderten Seite einsammeln
    const hrefs = await page.$$eval("a[href]", (as) =>
      as.map((a) => a.getAttribute("href"))
    );
    for (const h of hrefs) {
      const r = normalizeRoute(h);
      if (r && !visited.has(r) && !queue.includes(r)) queue.push(r);
    }
  }

  await browser.close();

  console.log();
  console.log(`Routen besucht: ${visited.size}`);
  console.log(`Asset-Responses ≥400: ${failed.length}`);
  console.log(`Routen mit NotFound-Markup: ${notFoundRoutes.length}`);
  console.log();

  // Dedupe failed by url+fromRoute
  const seen = new Set();
  const uniqueFailed = failed.filter((f) => {
    const key = f.status + "|" + f.url + "|" + f.fromRoute;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (uniqueFailed.length) {
    console.log("FAILED RESPONSES:");
    for (const f of uniqueFailed) {
      console.log(`  ${String(f.status).padEnd(4)}  ${f.url}`);
      console.log(`        from route: ${f.fromRoute}`);
    }
    console.log();
  }

  if (notFoundRoutes.length) {
    console.log("ROUTES RENDERED AS NOT-FOUND:");
    for (const n of notFoundRoutes) {
      console.log(`  ${n.route}`);
      console.log(`     -> "${n.marker.replace(/\s+/g, " ")}"`);
    }
    console.log();
  }

  const ok = uniqueFailed.length === 0 && notFoundRoutes.length === 0;
  if (ok) {
    console.log("Alle Live-Links erreichbar.");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
