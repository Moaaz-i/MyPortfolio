import { readFile } from 'node:fs/promises'

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function timeAgo(iso) {
  if (!iso) return ''
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 60) return 'just now'
  const m = Math.floor(d / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const yrs = Math.floor(months / 12)
  return `${yrs}y ago`
}

function monthYear(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

// On-demand screenshot provider (WordPress mshots) — captures a fresh picture of
// the live site when a visitor opens the page, and caches it server-side.
// Initializer prefers the local static shot; live-shots.js upgrades to a fresh
// capture per visit.
function shotProvider(url, stamp) {
  return 'https://s0.wp.com/mshots/v1/' + encodeURIComponent(String(url || '')) + '?w=1024&h=640&v=' + (stamp || new Date().toISOString().slice(0, 10))
}

function isRealSite(url) {
  if (!/^https?:\/\//i.test(String(url || ''))) return false
  const host = String(url).replace(/^https?:\/\//i, '').split('/')[0].toLowerCase()
  return !/^(www\.)?github\.com$/.test(host)
}

async function loadRepos() {
  try {
    const txt = await readFile(new URL('../../public/repos.json', import.meta.url), 'utf8')
    return JSON.parse(txt)
  } catch {
    return []
  }
}

function repoCard(r) {
  const topics = r.topics || []
  const chips = topics.slice(0, 4).map((t) => `<span class="chip">${esc(t)}</span>`).join('')
  const moreChips = topics.length > 4 ? `<span class="chip">+${topics.length - 4}</span>` : ''
  const stack = (r.topLangs || []).map((l) => esc(l.lang)).join(' · ')
  const liveShot = isRealSite(r.demo)
    ? `<a class="repo-shot" href="${esc(r.demo)}" target="_blank" rel="noopener" aria-label="Open live preview of ${esc(r.name)}"><img src="${r.shot ? esc(r.shot) : esc(shotProvider(r.demo))}" alt="Live preview of ${esc(r.name)}" loading="lazy" data-live-shot data-live="${esc(r.demo)}" data-static="${esc(r.shot || '')}"></a>`
    : ''
  return `
    <article class="repo-card">
      ${liveShot}
      <div class="repo-card-top">
        <h3 class="repo-name"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a></h3>
        <div class="repo-badges">
          ${r.latestRelease ? `<span class="repo-badge accent">${esc(r.latestRelease.tag)}</span>` : ''}
          ${r.license ? `<span class="repo-badge">${esc(r.license)}</span>` : ''}
          ${r.archived ? '<span class="repo-badge warn">Archived</span>' : ''}
        </div>
      </div>
      ${r.desc ? `<p class="repo-desc">${esc(r.desc)}</p>` : ''}
      ${chips || moreChips ? `<div class="repo-chips">${chips}${moreChips}</div>` : ''}
      <div class="repo-meta">
        ${r.lang ? `<span class="repo-lang">${esc(r.lang)}</span>` : ''}
        ${r.stars ? `<span class="repo-star">★ ${r.stars}</span>` : ''}
        ${r.forks ? `<span class="repo-cnt">⑂ ${r.forks}</span>` : ''}
        ${r.openIssues ? `<span class="repo-cnt">${r.openIssues} issues</span>` : ''}
        ${r.contributors > 1 ? `<span class="repo-cnt">${r.contributors} contributors</span>` : ''}
      </div>
      ${stack ? `<div class="repo-stack">${stack}</div>` : ''}
      <div class="repo-foot">
        ${r.pushedAt ? `<span class="repo-time">${timeAgo(r.pushedAt)}</span>` : ''}
        ${r.createdAt ? `<span class="repo-created">${monthYear(r.createdAt)}</span>` : ''}
        <div class="repo-links">
          <a class="btn btn-sm btn-ghost" href="${esc(r.url)}" target="_blank" rel="noopener">Source ↗</a>
          ${r.demo ? `<a class="btn btn-sm btn-outline" href="${esc(r.demo)}" target="_blank" rel="noopener">Live ↗</a>` : ''}
        </div>
      </div>
    </article>
  `
}

export default async function ReposBrowser(props) {
  const { title } = props
  const repos = await loadRepos()
  const perPage = 12
  const firstPage = repos.slice(0, perPage)
  const langs = [...new Set((repos || []).map((r) => r.lang).filter(Boolean))]

  return `
    <section class="repos-section" id="repos">
      ${title ? `<div class="section-head">
        <h2 class="section-title">${esc(title)}</h2>
        <span class="section-count">${repos.length} repos</span>
      </div>` : ''}
      <p class="section-subtitle">Sorted by recent activity — every original (non-forked) repository on <a href="https://github.com/Moaaz-i" target="_blank" rel="noopener">github.com/Moaaz-i</a>. ${langs.length} languages, enriched live from the GitHub API.</p>
      <div class="repos-grid">
        ${firstPage.map(repoCard).join('\n')}
      </div>
      <nav class="repos-pager" data-per-page="${perPage}" data-grid=".repos-grid" aria-label="Pagination"></nav>
    </section>
  `
}