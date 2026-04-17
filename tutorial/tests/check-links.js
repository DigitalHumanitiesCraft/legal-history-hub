/**
 * Link Checker for the Tutorial Website
 *
 * Validates all internal Markdown links within tutorial/:
 * - File references (e.g., 01-genai-und-prompt-engineering.md)
 * - Anchor links to glossar.md headings (e.g., glossar.md#token)
 * - Relative paths (e.g., ../docs/DESIGN.md)
 * - Image references
 *
 * Usage: node tutorial/tests/check-links.js
 */

const fs = require('fs');
const path = require('path');

const TUTORIAL_DIR = path.resolve(__dirname, '..');
const ERRORS = [];
const WARNINGS = [];
let filesChecked = 0;
let linksChecked = 0;

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
 * Extract all Markdown + inline HTML links from content
 * Returns array of { text, href, line, kind }
 *   kind: 'md' (regular Markdown link) or 'html' (inline <a href>)
 * HTML <a> links get kind 'html' and are treated as browser-resolved (relative
 * to the Docsify root), not as Docsify Hash-Router routes.
 */
function extractLinks(content) {
  const links = [];
  const lines = content.split('\n');
  const mdLinkRegex = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlLinkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Toggle fenced code blocks (``` or ~~~)
    if (/^```|^~~~/.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Remove inline code spans before checking for links
    const cleaned = line.replace(/`[^`]+`/g, '');

    let match;
    mdLinkRegex.lastIndex = 0;
    while ((match = mdLinkRegex.exec(cleaned)) !== null) {
      // Strip Docsify link helpers: [text](url ':target=_blank')
      const href = match[2].replace(/\s+['"][^'"]*['"]\s*$/, '');
      links.push({ text: match[1], href, line: i + 1, kind: 'md' });
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

  // Split href into file path and anchor
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

  // Path resolution depends on link kind:
  //   - Markdown links ([text](url)): Docsify Hash-Router intercepts them.
  //     Relative paths resolve against the source file's directory.
  //   - Inline HTML links (<a href="url">): the browser resolves them against
  //     the current page URL, which under Docsify Hash-Routing is always
  //     TUTORIAL_DIR (the docsify root), regardless of which Markdown source
  //     rendered the content. This matters for PDFs/assets in subfolders.
  //   - Absolute hrefs starting with "/" always resolve from TUTORIAL_DIR.
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

  // Check anchor within target file
  if (anchorPart) {
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
