// ============================================================
// JJOKAH Portfolio — blog.js
// Blog post loader: reads posts/index.json, renders post cards,
// and fetches individual .md files for the post viewer.
// ============================================================

// Posts always live at /blog/posts/ — absolute from origin root
const POSTS_ROOT = location.origin + '/blog/posts/';

/* ---------- Fetch post manifest ---------- */
async function fetchManifest() {
  const res = await fetch(POSTS_ROOT + 'index.json');
  if (!res.ok) throw new Error('Could not load post manifest');
  return res.json();
}

/* ---------- Format date ---------- */
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

/* ---------- Build post URL ---------- */
function postUrl(slug) {
  // Works from both home page and blog/index.html
  const base = location.pathname.includes('/blog/') ? '' : 'blog/';
  return `${base}post.html?slug=${encodeURIComponent(slug)}`;
}

/* ==========================================================
   HOME PAGE — recent posts preview (blog-preview section)
   ========================================================== */
async function renderRecentPosts(containerId, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const posts = await fetchManifest();
    const recent = posts.slice(0, limit);

    if (recent.length === 0) {
      container.innerHTML = '<p class="empty-state">No posts yet — check back soon!</p>';
      return;
    }

    container.innerHTML = recent.map(post => `
      <a href="${postUrl(post.slug)}" class="card post-card" style="text-decoration:none;display:flex;flex-direction:column;gap:.75rem;">
        <div class="post-meta">
          <span class="post-date">${fmtDate(post.date)}</span>
          ${post.readTime ? `<span>· ${post.readTime} min read</span>` : ''}
        </div>
        <h3>${escHtml(post.title)}</h3>
        <p>${escHtml(post.excerpt)}</p>
        <div class="post-tags">
          ${(post.tags || []).map(t => `<span class="chip">${escHtml(t)}</span>`).join('')}
        </div>
      </a>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Could not load posts.</p>';
    console.error(err);
  }
}

/* ==========================================================
   BLOG LIST PAGE — all posts
   ========================================================== */
async function renderAllPosts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show skeleton
  container.innerHTML = [1,2,3].map(() => `
    <div class="card" style="padding:1.5rem 1.75rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;">
      <div class="skeleton" style="width:80px;height:14px;"></div>
      <div>
        <div class="skeleton" style="width:60%;height:16px;margin-bottom:8px;"></div>
        <div class="skeleton" style="width:90%;height:12px;"></div>
      </div>
      <div class="skeleton" style="width:16px;height:16px;"></div>
    </div>
  `).join('');

  try {
    const posts = await fetchManifest();

    if (posts.length === 0) {
      container.innerHTML = '<p class="empty-state">No posts yet — check back soon!</p>';
      return;
    }

    container.innerHTML = posts.map(post => `
      <div class="card post-list-item" onclick="location.href='${postUrl(post.slug)}'" role="button" tabindex="0"
           onkeydown="if(event.key==='Enter')location.href='${postUrl(post.slug)}'">
        <span class="post-list-date">${fmtDate(post.date)}</span>
        <div>
          <div class="post-list-title">${escHtml(post.title)}</div>
          <div class="post-list-excerpt">${escHtml(post.excerpt)}</div>
          <div class="post-tags" style="margin-top:.5rem;">
            ${(post.tags || []).map(t => `<span class="chip">${escHtml(t)}</span>`).join('')}
          </div>
        </div>
        <span class="post-list-arrow">→</span>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Could not load posts.</p>';
    console.error(err);
  }
}

/* ==========================================================
   SINGLE POST PAGE — fetch & render markdown
   ========================================================== */
async function renderPost() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if (!slug) { showPostError('No post specified.'); return; }

  const titleEl    = document.getElementById('post-title');
  const dateEl     = document.getElementById('post-date');
  const tagsEl     = document.getElementById('post-tags');
  const contentEl  = document.getElementById('post-content');
  const metaTitleEl = document.querySelector('title');

  // Show loading skeleton
  if (contentEl) {
    contentEl.innerHTML = [1,2,3,4].map(() =>
      `<div class="skeleton" style="height:16px;width:${70+Math.random()*25}%;margin-bottom:12px;"></div>`
    ).join('');
  }

  try {
    // Load manifest to get metadata
    const posts = await fetchManifest();
    const meta  = posts.find(p => p.slug === slug);

    if (meta) {
      if (titleEl) titleEl.textContent = meta.title;
      if (dateEl)  dateEl.textContent  = fmtDate(meta.date);
      if (metaTitleEl) metaTitleEl.textContent = `${meta.title} — JJOKAH`;
      if (tagsEl)  tagsEl.innerHTML = (meta.tags || []).map(t =>
        `<span class="chip">${escHtml(t)}</span>`).join('');
      // Set og:title if present
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', meta.title);
    }

    // Fetch markdown file
    const mdRes = await fetch(POSTS_ROOT + slug + '.md');
    if (!mdRes.ok) throw new Error('Post file not found');
    const markdown = await mdRes.text();

    // Render with marked.js (loaded via CDN in post.html)
    if (typeof marked !== 'undefined' && contentEl) {
      marked.setOptions({ gfm: true, breaks: true });
      contentEl.innerHTML = marked.parse(markdown);
      // Syntax highlight if hljs is available
      if (typeof hljs !== 'undefined') {
        contentEl.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
      }
    }
  } catch (err) {
    showPostError('Could not load this post. It may have been moved or deleted.');
    console.error(err);
  }
}

function showPostError(msg) {
  const el = document.getElementById('post-content');
  if (el) el.innerHTML = `<p class="empty-state" style="padding:2rem 0;">${msg}</p>`;
}

/* ---------- Utility ---------- */
function escHtml(str = '') {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
