/**
 * HTTP Asset Checker for the Tutorial Website
 *
 * Spins up a local HTTP server on tutorial/ (via Node's built-in http module,
 * no dependencies) and verifies that every non-Markdown asset link resolves to
 * a real file at the URL the browser would fetch under Docsify Hash-Routing:
 *
 *   - Markdown links [text](url) to .md files: skipped here (covered by
 *     check-links.js; Docsify intercepts them as hash routes).
 *   - Inline HTML <a href="url">: browser resolves relative to the current
 *     page, which under Hash-Routing is always the Docsify root (tutorial/).
 *     We HEAD-fetch it against the server.
 *   - Markdown asset links [text](file.pdf) — these are a trap: Docsify
 *     rewrites them to #/<path> and they will 404. We flag them as errors so
 *     the PDF regression does not return.
 *
 * The test fails if:
 *   - Any HTML asset link returns non-200
 *   - Any HTML asset link returns content-type text/html (Docsify 404 fallback)
 *   - Any Markdown link points to a non-.md asset (PDF, ZIP, DOCX, etc.) —
 *     these must be authored as HTML <a href=... target="_blank"> instead.
 *
 * Usage: node tutorial/tests/check-assets-http.js
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const TUTORIAL_DIR = path.resolve(__dirname, '..');
const PORT = 7788;
const ASSET_EXTENSIONS = ['.pdf', '.zip', '.docx', '.xlsx', '.csv', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg'];

const ERRORS = [];
let linksChecked = 0;

// ------------------------------------------------------------------
// Minimal static file server (no deps)
// ------------------------------------------------------------------

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.zip': 'application/zip',
};

function startServer(rootDir, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath;
      try {
        urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
      } catch {
        res.writeHead(400); res.end(); return;
      }
      // Guard against path traversal
      const safePath = path.normalize(path.join(rootDir, urlPath));
      if (!safePath.startsWith(rootDir)) {
        res.writeHead(403); res.end(); return;
      }
      fs.stat(safePath, (err, stat) => {
        if (err || !stat.isFile()) {
          res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
          res.end('Not Found');
          return;
        }
        const ext = path.extname(safePath).toLowerCase();
        res.writeHead(200, {
          'content-type': CONTENT_TYPES[ext] || 'application/octet-stream',
          'content-length': stat.size,
        });
        // HEAD: no body
        if (req.method === 'HEAD') { res.end(); return; }
        fs.createReadStream(safePath).pipe(res);
      });
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

function httpHead(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        status: res.statusCode,
        contentType: res.headers['content-type'] || '',
      });
      res.resume();
    });
    req.on('error', reject);
    req.end();
  });
}

// ------------------------------------------------------------------
// Link extraction (same philosophy as check-links.js, but HTML-aware)
// ------------------------------------------------------------------

function findMarkdownFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'docs' && entry.name !== 'tests') {
      findMarkdownFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function extractLinks(content) {
  const links = [];
  const lines = content.split('\n');
  const mdLinkRegex = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlLinkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let inCodeBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```|^~~~/.test(line.trim())) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;
    const cleaned = line.replace(/`[^`]+`/g, '');

    let match;
    mdLinkRegex.lastIndex = 0;
    while ((match = mdLinkRegex.exec(cleaned)) !== null) {
      const href = match[2].replace(/\s+['"][^'"]*['"]\s*$/, '');
      links.push({ href, line: i + 1, kind: 'md' });
    }
    htmlLinkRegex.lastIndex = 0;
    while ((match = htmlLinkRegex.exec(cleaned)) !== null) {
      links.push({ href: match[1], line: i + 1, kind: 'html' });
    }
  }
  return links;
}

function isExternal(href) {
  return /^(https?:|mailto:|#)/.test(href);
}

function assetExtension(href) {
  const pathPart = href.split('#')[0].split('?')[0].toLowerCase();
  return ASSET_EXTENSIONS.find(ext => pathPart.endsWith(ext));
}

// ------------------------------------------------------------------
// Main
// ------------------------------------------------------------------

(async () => {
  console.log(`\nHTTP Asset Checker for tutorial/\n${'='.repeat(40)}\n`);
  const server = await startServer(TUTORIAL_DIR, PORT);
  console.log(`Started local server at http://127.0.0.1:${PORT}/\n`);

  try {
    const files = findMarkdownFiles(TUTORIAL_DIR);

    for (const file of files) {
      const rel = path.relative(TUTORIAL_DIR, file);
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractLinks(content);

      for (const { href, line, kind } of links) {
        if (isExternal(href)) continue;

        // Rule: asset links (pdf, zip, ...) MUST be authored as HTML <a>.
        // Markdown [text](file.pdf) is trapped by Docsify's hash router.
        const ext = assetExtension(href);
        if (ext && kind === 'md') {
          ERRORS.push(
            `${rel}:${line} - Asset link "${href}" uses Markdown syntax; ` +
            `Docsify will rewrite it to a hash route and 404. ` +
            `Use inline HTML instead: <a href="..." target="_blank" rel="noopener">text</a>`
          );
          continue;
        }

        // Only HEAD-check HTML asset links — Markdown .md links are covered
        // by check-links.js (filesystem resolution).
        if (kind !== 'html') continue;
        if (!ext) continue;

        linksChecked++;
        const url = `http://127.0.0.1:${PORT}/${href.replace(/^\//, '')}`;
        try {
          const { status, contentType } = await httpHead(url);
          if (status !== 200) {
            ERRORS.push(`${rel}:${line} - HTTP ${status} for ${href}`);
          } else if (contentType.startsWith('text/html')) {
            ERRORS.push(`${rel}:${line} - ${href} served as text/html (Docsify fallback?)`);
          }
        } catch (e) {
          ERRORS.push(`${rel}:${line} - Request failed for ${href}: ${e.message}`);
        }
      }
    }

    console.log(`Asset links HEAD-checked: ${linksChecked}\n`);

    if (ERRORS.length === 0) {
      console.log('All asset links reachable.\n');
      process.exitCode = 0;
    } else {
      console.log(`${ERRORS.length} problem(s) found:\n`);
      for (const err of ERRORS) console.log(`  ERROR: ${err}`);
      console.log('');
      process.exitCode = 1;
    }
  } finally {
    server.close();
  }
})();
