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

export default function Page(props) {
  const { page, content, sectionsHtml, site, nav, docsNav: docsNavList } = props
  const docs = site?.docs === true
  const L = site.labels || {}
  const pagePath = String(page.url || '/')
  const pageHref = (u) => {
    const s = String(u || '')
    const href = /^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(s) ? s || '/' : '/' + s
    return safeHref(href)
  }
  const list = docs && Array.isArray(docsNavList) && docsNavList.length ? docsNavList : (nav || [])
  const pageLinks = (list || []).filter((item) =>
    item && item.url && item.url !== '/' && !/^(?:[a-z][a-z\d+.-]*:|#)/i.test(String(item.url || ''))
  )
  const currentIndex = pageLinks.findIndex((item) => pageHref(item.url) === pagePath)
  const previous = currentIndex > 0 ? pageLinks[currentIndex - 1] : null
  const next = currentIndex >= 0 && currentIndex < pageLinks.length - 1 ? pageLinks[currentIndex + 1] : null
  const link = (item) => `<a href="${pageHref(item.url)}">${esc(item.label)}</a>`
  const docsNav = docs ? `
      <nav class="docs-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">${esc(site.title || 'Home')}</a><span aria-hidden="true">/</span><span>${esc(page.data.title || '')}</span>
      </nav>` : ''
  const docsFooter = docs && (previous || next) ? `
      <nav class="docs-pagination" aria-label="Page navigation">
        ${previous ? `<a class="docs-prev" href="${pageHref(previous.url)}"><small>Previous</small><strong>← ${esc(previous.label)}</strong></a>` : '<span></span>'}
        ${next ? `<a class="docs-next" href="${pageHref(next.url)}"><small>Next</small><strong>${esc(next.label)} →</strong></a>` : '<span></span>'}
      </nav>` : ''

  const tagChips = Array.isArray(page.data.tags) && page.data.tags.length
    ? `<div class="project-tags page-tags">${page.data.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`
    : ''
  const projectLinks = (page.data.demo || page.data.repo) ? `
      <div class="project-links page-links">
        ${page.data.demo ? `<a class="btn" href="${esc(safeHref(page.data.demo))}" target="_blank" rel="noopener">${esc(L.liveDemo || 'Live demo')} ↗</a>` : ''}
        ${page.data.repo ? `<a class="btn btn-outline" href="${esc(safeHref(page.data.repo))}" target="_blank" rel="noopener">${esc(L.source || 'Source')} ↗</a>` : ''}
      </div>` : ''

  return `
    <article class="content-page">
      ${docsNav}
      <header class="page-header">
        <h1 class="page-title">${esc(page.data.title || '')}</h1>
        ${page.data.date && page.url.startsWith('/projects') ? `<time class="project-date">${esc(page.data.date)}</time>` : ''}
        ${tagChips}
        ${projectLinks}
        ${page.data.subtitle ? `<p class="page-subtitle">${esc(page.data.subtitle)}</p>` : ''}
      </header>
      <div class="page-content">
        ${content}
      </div>
      ${sectionsHtml || ''}
      ${docsFooter}
    </article>
  `
}