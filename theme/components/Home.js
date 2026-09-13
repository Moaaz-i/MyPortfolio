function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function safeHref(url) {
  const s = String(url || '')
  if (!s || /^(?:javascript:|vbscript:|data:)/i.test(s)) return '#'
  return s
}

const ROLES = ['Full-Stack Engineer', 'Systems Engineer', 'Open-Source Maintainer', 'Embedded Developer', 'Tooling Creator']

export default function Home(props) {
  const { site, page, content, projects, sectionsHtml } = props
  const hero = page.data.hero || site.hero || {}
  const title = hero.title || page.data.title || site.title || 'Hello'
  const subtitle = hero.subtitle || page.data.subtitle || site.tagline || ''
  const avatar = hero.avatar || site.avatar || ''
  const heroPhoto = hero.photo || '/hero.png'
  const initials = (title || '')
    .replace(/[^A-Za-z ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  const L = site.labels || {}

  const roleWords = ROLES.map(
    (r, i) => `<span class="role-word" style="animation-delay:${i * 2.4}s">${esc(r)}</span>`
  ).join('')

  const projectCards = (projects || []).map((p, i) => {
    const tags = Array.isArray(p.data.tags)
      ? p.data.tags.map((t) => `<span class="tag" data-tag="${esc(t)}">${esc(t)}</span>`).join('')
      : ''
    const tagAttrs = Array.isArray(p.data.tags) ? p.data.tags.map((t) => `tag-${esc(t)}`).join(' ') : ''
    const desc = p.data.excerpt || p.data.description || p.body.split('\n').slice(0, 3).join(' ')
    const liveAttrs = p.data.demo && /^https?:\/\//i.test(String(p.data.demo)) && !/^(?:https?:\/\/)?(?:www\.)?github\.com\//i.test(String(p.data.demo))
      ? ` data-live-shot data-live="${esc(p.data.demo)}" data-static="${esc(p.data.cover || '')}"`
      : ''
    const cover = p.data.cover
      ? `<div class="project-cover"><img src="${esc(p.data.cover)}" alt="${esc(p.data.title || '')}" loading="lazy"${liveAttrs}><div class="cover-shine"></div></div>`
      : '<div class="project-cover project-cover-plain"></div>'
    return `
      <article class="project-card" data-tags="${tagAttrs}" style="animation-delay:${(i % 3) * 0.08}s" data-animate>
        ${cover}
        <div class="project-body">
          <h3 class="project-title"><a href="/${esc(p.url)}">${esc(p.data.title || p.path)}</a></h3>
          ${p.data.date ? `<time class="project-date">${esc(p.data.date)}</time>` : ''}
          <p class="project-desc">${esc(desc)}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-links">
            ${p.data.demo ? `<a class="btn btn-sm" href="${esc(safeHref(p.data.demo))}" target="_blank" rel="noopener">${esc(L.liveDemo || 'Live demo')}</a>` : ''}
            ${p.data.repo ? `<a class="btn btn-sm btn-outline" href="${esc(safeHref(p.data.repo))}" target="_blank" rel="noopener">${esc(L.source || 'Source')}</a>` : ''}
            <a class="btn btn-sm btn-ghost" href="/${esc(p.url)}">${esc(L.details || 'Details')} →</a>
          </div>
        </div>
      </article>
    `
  }).join('\n      ')

  const filterBar = (projects || []).length > 1 ? buildFilterBar(projects, L) : ''
  const siteUrl = site.url || ''
  const sameAs = (site.sameAs || [])

  const heroLinks = (hero.links || [{ label: 'View Projects', url: '#projects' }])
  const heroButtons = heroLinks.map((l) => {
    const primary = l.primary ? ' btn-primary' : ''
    return `<a href="${esc(safeHref(l.url))}" class="btn${primary}">${esc(l.label)}${l.label === 'View Projects' || l.url === '#projects' ? ' ↓' : ''}</a>`
  }).join('')

  return `
    <section class="hero" id="top">
      <div class="hero-orbs" aria-hidden="true">
        <span class="orb orb-1"></span>
        <span class="orb orb-2"></span>
        <span class="orb orb-3"></span>
        <span class="orb orb-4"></span>
      </div>
      <div class="hero-inner">
        ${
          heroPhoto
            ? `<figure class="hero-photo"><img src="${esc(heroPhoto)}" alt="${esc(title)}" width="1200" height="900" fetchpriority="high"></figure>`
            : avatar
              ? `<div class="hero-avatar"><img src="${esc(avatar)}" alt="${esc(title)}" width="140" height="140"></div>`
              : `<div class="hero-avatar hero-mono" aria-hidden="true"><span>${esc(initials)}</span></div>`
        }
        ${sameAs.length && siteUrl ? '' : `<span class="hero-badge">Open to work</span>`}
        <h1 class="hero-title">${esc(title)}</h1>
        <div class="hero-roles" aria-label="Roles">${roleWords}</div>
        ${subtitle ? `<p class="hero-subtitle">${esc(subtitle)}</p>` : ''}
        ${heroButtons ? `<div class="hero-links">${heroButtons}</div>` : ''}
        <a class="hero-scroll" href="#projects" aria-label="Scroll to projects">
          <span></span>
        </a>
      </div>
    </section>

    <div class="page-content" data-animate>${content}</div>

    ${projectCards ? `
      <section class="projects-section" id="projects">
        <div class="section-head">
          <h2 class="section-title">${esc(site.projectsTitle || L.projects || 'Projects')}</h2>
          <div class="section-head-side">
            <span class="section-count">${projects.length} featured</span>
            <a class="section-more" href="/repos">All repos ↗</a>
          </div>
        </div>
        ${filterBar}
        <div class="projects-grid">${projectCards}</div>
      </section>
    ` : ''}

    ${sectionsHtml || ''}
  `
}

function buildFilterBar(projects, L) {
  const tags = []
  for (const p of projects) {
    for (const t of (p.data.tags || [])) {
      if (!tags.includes(t)) tags.push(t)
    }
  }
  const btns = (tags.length ? ['*', ...tags] : []).map((t) => {
    const key = esc(t)
    const label = t === '*' ? (L.all || 'All') : t
    const active = t === '*' ? ' class="filter-btn active"' : ' class="filter-btn"'
    return `<button type="button" data-filter="${key}"${active}>${esc(label)}</button>`
  }).join('')
  return `<div class="project-filters">${btns}</div>`
}