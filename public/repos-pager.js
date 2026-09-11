(function () {
  // Client-side pagination for the /repos page. Reads the static
  // public/repos.json and slices it into pages of N (default 12), then
  // reconciles against GitHub's live listing so deleted repos disappear and
  // newly created ones appear without regenerating the snapshot. Forks are
  // always excluded. The first page is pre-rendered server-side (SSR/SEO).
  // Strict-CSP friendly: no inline handlers, no inline scripts.

  if (!('fetch' in window)) return

  var CACHE = null
  var HIDDEN = null
  var pager = null
  var grid = null
  var perPage = 12
  var current = 1

  function init() {
    pager = document.querySelector('.repos-pager[data-per-page]')
    grid = pager ? document.querySelector(pager.getAttribute('data-grid')) : null
    if (!pager || !grid) return
    perPage = parseInt(pager.getAttribute('data-per-page'), 10) || 12
    Promise.all([fetchRepos(), fetchHidden()]).then(function () {
      // Always re-render so hidden/deleted repos never linger in the SSR grid.
      current = currentPage()
      render(current)
      syncFromGitHub()
    }).catch(function () {
      // repos.json unavailable — try the live listing alone.
      syncFromGitHub()
    })
  }

  function fetchRepos() {
    if (CACHE) return Promise.resolve(CACHE)
    return fetch('/repos.json').then(function (r) {
      if (!r.ok) throw new Error('repos.json unavailable')
      return r.json()
    }).then(function (d) { CACHE = d; return d })
  }

  // Manually hidden repos (public/repos-hidden.json). Deleted repos need no
  // entry here — the live sync drops them automatically.
  function fetchHidden() {
    if (HIDDEN) return Promise.resolve(HIDDEN)
    return fetch('/repos-hidden.json').then(function (r) {
      if (!r.ok) return []
      return r.json()
    }).then(function (d) {
      HIDDEN = Array.isArray(d) ? d : []
      return HIDDEN
    }, function () { HIDDEN = []; return HIDDEN })
  }

  function visibleRepoList() {
    if (!CACHE) return []
    if (!HIDDEN || !HIDDEN.length) return CACHE
    return CACHE.filter(function (r) { return HIDDEN.indexOf(r.name) === -1 })
  }

  // Merge a live GitHub listing with the enriched (but possibly stale) snapshot.
  // Deleted repos drop out automatically; newly created ones appear; forks are
  // always excluded. Falls back to a cached listing from this session.
  function syncFromGitHub() {
    fetch('https://api.github.com/users/Moaaz-i/repos?per_page=100&sort=updated')
      .then(function (r) {
        if (!r.ok) throw new Error('live listing unavailable')
        return r.json()
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) throw new Error('unexpected payload')
        mergeLive(rows)
        sessionCache(rows)
        rebuild()
      })
      .catch(function () {
        var cached = null
        try { cached = JSON.parse(sessionStorage.getItem('moz-repos-live') || 'null') } catch (e) { cached = null }
        if (cached && Array.isArray(cached.data)) {
          mergeLive(cached.data)
          rebuild()
        }
      })
  }

  function sessionCache(rows) {
    try { sessionStorage.setItem('moz-repos-live', JSON.stringify({ ts: Date.now(), data: rows })) } catch (e) { /* ignore */ }
  }

  function mergeLive(live) {
    var stored = {}
    ;(CACHE || []).forEach(function (r) { stored[r.name] = r })
    var merged = []
    live.forEach(function (l) {
      if (l.fork) return
      if (HIDDEN && HIDDEN.indexOf(l.name) !== -1) return
      var p = stored[l.name] || {}
      merged.push({
        name: l.name,
        desc: (l.description || '').replace(/\s+/g, ' ').trim(),
        lang: l.language || '',
        url: l.html_url,
        demo: l.homepage || '',
        stars: l.stargazers_count || 0,
        forks: l.forks_count || 0,
        openIssues: l.open_issues_count || 0,
        sizeKb: l.size || 0,
        license: l.license ? (l.license.spdx_id || l.license.name || '') : (p.license || ''),
        topics: Array.isArray(l.topics) && l.topics.length ? l.topics : (p.topics || []),
        archived: !!l.archived || !!p.archived,
        hasPages: !!l.has_pages || !!p.hasPages,
        defaultBranch: l.default_branch || p.defaultBranch || '',
        createdAt: l.created_at || p.createdAt || '',
        pushedAt: l.pushed_at || p.pushedAt || '',
        updatedAt: l.updated_at || p.updatedAt || '',
        topLangs: p.topLangs || [],
        contributors: p.contributors || 0,
        latestRelease: p.latestRelease || null
      })
    })
    CACHE = merged
  }

  function rebuild() {
    if (!pager || !grid || !CACHE || !CACHE.length) return
    var p = currentPage()
    current = p
    render(p)
  }

  function maxPages() {
    var n = visibleRepoList().length
    return n ? Math.ceil(n / perPage) : 1
  }

  function currentPage() {
    var m = (window.location.hash || '').match(/#page-(\d+)/)
    var p = m ? parseInt(m[1], 10) : 1
    var max = maxPages()
    if (p > max) p = max
    if (p < 1) p = 1
    return p
  }

  function esc(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
  }

  function timeAgo(iso) {
    if (!iso) return ''
    var d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (d < 60) return 'just now'
    var m = Math.floor(d / 60)
    if (m < 60) return m + 'm ago'
    var h = Math.floor(m / 60)
    if (h < 48) return h + 'h ago'
    var days = Math.floor(h / 24)
    if (days < 30) return days + 'd ago'
    var months = Math.floor(days / 30)
    if (months < 12) return months + 'mo ago'
    return Math.floor(months / 12) + 'y ago'
  }

  function monthYear(iso) {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch (e) { return '' }
  }

  function card(r) {
    var topics = r.topics || []
    var chips = topics.slice(0, 4).map(function (t) { return '<span class="chip">' + esc(t) + '</span>' }).join('')
    var moreChips = topics.length > 4 ? '<span class="chip">+' + (topics.length - 4) + '</span>' : ''
    var stack = (r.topLangs || []).map(function (l) { return esc(l.lang) }).join(' · ')
    return `
      <article class="repo-card">
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

  function controls() {
    var total = maxPages()
    var nums = []
    for (var i = 1; i <= total; i++) {
      nums.push('<button type="button" class="page-btn' + (i === current ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>')
    }
    return (
      '<button type="button" class="page-btn prev" data-dir="-1"' + (current === 1 ? ' disabled' : '') + '>← Prev</button>' +
      nums.join('') +
      '<button type="button" class="page-btn next" data-dir="1"' + (current === total ? ' disabled' : '') + '>Next →</button>' +
      '<span class="pager-info">' + visibleRepoList().length + ' repos</span>'
    )
  }

  function render(page) {
    current = page
    var list = visibleRepoList()
    var start = (page - 1) * perPage
    grid.innerHTML = list.slice(start, start + perPage).map(card).join('\n')
    pager.innerHTML = controls()
    var hash = '#page-' + page
    if (window.location.hash !== hash) {
      try { history.replaceState(null, '', hash) } catch (e) { /* ignore */ }
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.repos-pager .page-btn') : null
    if (!btn || btn.disabled) return
    var raw = btn.hasAttribute('data-page')
      ? parseInt(btn.getAttribute('data-page'), 10)
      : current + parseInt(btn.getAttribute('data-dir') || '0', 10)
    var apply = function () {
      var max = maxPages()
      if (raw < 1) raw = 1
      if (raw > max) raw = max
      render(raw)
      var section = document.querySelector('.repos-section')
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (CACHE) apply()
    else fetchRepos().then(apply).catch(function () {})
  })

  window.addEventListener('hashchange', function () {
    if (!pager || !CACHE) return
    var p = currentPage()
    if (p !== current) render(p)
  })

  // Re-init after SPA navigation swaps <main>.
  var main = document.querySelector('main')
  if (main && main.parentNode && 'MutationObserver' in window) {
    new MutationObserver(function () { init() }).observe(main.parentNode, { childList: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()