/**
 * Static Link Checker for the Tutorial Website
 *
 * Validates internal links within tutorial/ without touching the network:
 *   - Markdown links [text](url) to .md files: file existence + anchors
 *   - Image links ![alt](src): file existence
 *   - Inline HTML <a href> links: file existence (resolved against Docsify root)
 *   - Markdown asset links [text](file.pdf|zip|...) → ERROR (Docsify rewrites
 *     them to a hash route and 404s; must be authored as inline HTML <a>)
 *   - Upward-relative Markdown links "../foo.md" → ERROR (Docsify hash router
 *     does not collapse ".." reliably; verified with check-live-links.mjs)
 *
 * Companion test:
 *   - check-live-links.mjs    end-to-end smoke test against the deployed site
 *                             (Playwright, slow, catches router/case quirks)
 *
 * Usage: node tutorial/tests/check-links.js
 */

const fs = require('fs');
const path = require('path');

const TUTORIAL_DIR = path.resolve(__dirname, '..');
const ASSET_EXTENSIONS = ['.pdf', '.zip', '.docx', '.xlsx', '.csv', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg'];
const ERRORS = [];
let filesChecked = 0;
let linksChecked = 0;

function assetExtension(href) {
  const pathPart = href.split('#')[0].split('?')[0].toLowerCase();
  return ASSET_EXTENSIONS.find(ext => pathPart.endsWith(ext));
}

/**
 * Recursively find all .md files in a directory
 */
function findMarkdownFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      findMarkdownFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract all heading anchors from a Markdown file (Docsify-style slugification)
 */
function extractAnchors(content) {
  const anchors = new Set();
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    let text = match[1].trim();
    // Remove inline formatting
    text = text.replace(/\*\*(.+?)\*\*/g, '$1');
    text = text.replace(/\*(.+?)\*/g, '$1');
    text = text.replace(/`(.+?)`/g, '$1');
    text = text.replace(/\[(.+?)\]\(.+?\)/g, '$1');
    // Docsify slugification: lowercase, replace spaces and special chars with hyphens
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u024F-]/g, '') // keep letters, digits, spaces, hyphens, accented chars
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    anchors.add(slug);
  }
  return anchors;
}

/**
 * Extract Markdown links, image references, and inline HTML <a> links.
 * Returns array of { text, href, line, kind }
 *   kind: 'md'   regular Markdown link  → Docsify Hash-Router
 *         'img'  image reference        → browser-resolved
 *         'html' inline <a href>        → browser-resolved (Docsify root)
 */
function extractLinks(content) {
  const links = [];
  const lines = content.split('\n');
  const mdLinkRegex = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlLinkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^```|^~~~/.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const cleaned = line.replace(/`[^`]+`/g, '');

    let match;
    mdLinkRegex.lastIndex = 0;
    while ((match = mdLinkRegex.exec(cleaned)) !== null) {
      const href = match[2].replace(/\s+['"][^'"]*['"]\s*$/, '');
      links.push({ text: match[1], href, line: i + 1, kind: 'md' });
    }

    imgRegex.lastIndex = 0;
    while ((match = imgRegex.exec(cleaned)) !== null) {
      const href = match[2].replace(/\s+['"][^'"]*['"]\s*$/, '');
      links.push({ text: match[1], href, line: i + 1, kind: 'img' });
    }

    htmlLinkRegex.lastIndex = 0;
    while ((match = htmlLinkRegex.exec(cleaned)) !== null) {
      links.push({ text: match[2], href: match[1], line: i + 1, kind: 'html' });
    }
  }
  return links;
}

/**
 * Check if a link target exists
 */
function checkLink(link, sourceFile, anchorCache) {
  const { href, line, kind } = link;
  linksChecked++;

  // Skip external links
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return;
  }

  // Skip mailto links
  if (href.startsWith('mailto:')) {
    return;
  }

  const [filePart, anchorPart] = href.split('#');
  const relPath = path.relative(TUTORIAL_DIR, sourceFile);

  // Pure anchor link (#something) within the same file
  if (!filePart && anchorPart) {
    const sourceContent = fs.readFileSync(sourceFile, 'utf-8');
    const anchors = extractAnchors(sourceContent);
    if (!anchors.has(anchorPart)) {
      ERRORS.push(`${relPath}:${line} - Anchor #${anchorPart} not found in same file`);
    }
    return;
  }

  // Markdown asset trap: [text](file.pdf|zip|...) gets rewritten by Docsify
  // to a hash route and 404s. Asset links must be authored as inline HTML.
  if (kind === 'md' && assetExtension(filePart)) {
    ERRORS.push(`${relPath}:${line} - Asset link "${href}" uses Markdown syntax; Docsify rewrites it to a hash route and 404s. Use inline HTML: <a href="..." target="_blank" rel="noopener">text</a>`);
    return;
  }

  // Path resolution depends on link kind:
  //   - Markdown links ([text](url)): Docsify Hash-Router intercepts them.
  //     Relative paths resolve against the source file's directory.
  //   - Image references (![alt](src)): browser-resolved relative to the
  //     source file's directory (Docsify rewrites src at render time).
  //   - Inline HTML links (<a href="url">): browser resolves against the
  //     current page URL, which under Hash-Routing is always TUTORIAL_DIR.
  //   - Absolute hrefs starting with "/" always resolve from TUTORIAL_DIR.

  // Upward-relative Markdown links 404 under Docsify's hash router. Verified
  // against the live deploy via check-live-links.mjs: from #/slides/foo, the
  // link "../bar.md" produces a fetch one directory above tutorial/, not
  // beside it. Use absolute "/bar.md" instead.
  if (kind === 'md' && filePart.startsWith('../')) {
    ERRORS.push(`${relPath}:${line} - Upward-relative Markdown link "${filePart}" 404s under Docsify's hash router. Use absolute "/${filePart.replace(/^(\.\.\/)+/, '')}" instead.`);
    return;
  }

  const sourceDir = path.dirname(sourceFile);
  let targetPath;
  if (filePart.startsWith('/')) {
    const routePart = filePart === '/' ? 'README.md' : filePart.slice(1);
    targetPath = path.resolve(TUTORIAL_DIR, routePart);
  } else if (kind === 'html') {
    targetPath = path.resolve(TUTORIAL_DIR, filePart);
  } else {
    targetPath = path.resolve(sourceDir, filePart);
  }

  // Docsify scope check: links must stay inside tutorial/
  // (files outside are not reachable via Docsify routing, even if they exist on disk)
  const relativeTarget = path.relative(TUTORIAL_DIR, targetPath);
  if (relativeTarget.startsWith('..')) {
    ERRORS.push(`${relPath}:${line} - Link leaves Docsify scope (outside tutorial/): ${filePart}`);
    return;
  }

  // Check if file exists (with URL-decoded fallback, respecting the same
  // resolution root we used above).
  const decodedFile = decodeURIComponent(filePart);
  const decodeRoot = filePart.startsWith('/') || kind === 'html' ? TUTORIAL_DIR : sourceDir;
  const decodedPath = path.resolve(
    decodeRoot,
    filePart.startsWith('/') ? decodedFile.slice(1) : decodedFile
  );
  if (!fs.existsSync(targetPath) && !fs.existsSync(decodedPath)) {
    ERRORS.push(`${relPath}:${line} - File not found: ${filePart}`);
    return;
  }

  // Check anchor within target file (skip for images: PNG/JPG have no anchors)
  if (anchorPart && kind !== 'img') {
    const resolvedTarget = fs.existsSync(targetPath) ? targetPath : decodedPath;

    if (!anchorCache.has(resolvedTarget)) {
      const content = fs.readFileSync(resolvedTarget, 'utf-8');
      anchorCache.set(resolvedTarget, extractAnchors(content));
    }

    const anchors = anchorCache.get(resolvedTarget);
    if (!anchors.has(anchorPart)) {
      ERRORS.push(`${relPath}:${line} - Anchor #${anchorPart} not found in ${filePart} (available: ${[...anchors].join(', ')})`);
    }
  }
}

// --- Main ---

console.log(`\nLink Checker for tutorial/\n${'='.repeat(40)}\n`);

// Find all Markdown files (exclude docs/ folder as those are not rendered by Docsify)
const allFiles = findMarkdownFiles(TUTORIAL_DIR);
const renderableFiles = allFiles.filter(f => !f.includes(path.join('tutorial', 'docs')));
const docsFiles = allFiles.filter(f => f.includes(path.join('tutorial', 'docs')));

console.log(`Found ${renderableFiles.length} renderable .md files`);
console.log(`Found ${docsFiles.length} docs/ .md files (also checked)\n`);

const anchorCache = new Map();

// Check all files (both renderable and docs)
for (const file of allFiles) {
  filesChecked++;
  const content = fs.readFileSync(file, 'utf-8');
  const links = extractLinks(content);

  for (const link of links) {
    checkLink(link, file, anchorCache);
  }
}

// --- Report ---

console.log(`Files checked: ${filesChecked}`);
console.log(`Links checked: ${linksChecked}\n`);

if (ERRORS.length === 0) {
  console.log('All links valid!\n');
  process.exit(0);
} else {
  console.log(`${ERRORS.length} broken link(s) found:\n`);
  for (const err of ERRORS) {
    console.log(`  ERROR: ${err}`);
  }
  console.log('');
  process.exit(1);
}
