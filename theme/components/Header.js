function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const SEARCH_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>`
const BURGER_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`

export default function Header(props) {
  const { page, nav, site, sidebar } = props
  const avatar = site.avatar || (site.hero && site.hero.avatar) || ''
  const current = String((page && page.url) || '/').split('?')[0]
  const items = (nav || []).map((item) => {
    const rel = String(item.url || '')
    const href = /^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(rel) ? rel || '/' : '/' + rel
    const isExternal = /^(?:[a-z][a-z\d+.-]*:|#)/i.test(rel)
    const target = href.replace(/\/+$/, '') || '/'
    const active = !isExternal && current.length > 1 && (current === target || current + '/' === href)
    return `<a href="${esc(href)}" data-nav="${esc(item.label)}" class="nav-link${active ? ' active' : ''}">${esc(item.label)}</a>`
  }).join('')

  const hasNav = site.showNav !== false && items.length > 0
  const sidebarMenu = sidebar ? `<div class="sb-mobile">${sidebar.replace(' id="sidebar"', '')}</div>` : ''
  const hasMenu = hasNav || !!sidebar
  const navHtml = hasNav
    ? `<nav class="site-nav" id="site-nav">${items}${sidebarMenu}</nav>`
    : sidebar
      ? `<nav class="site-nav" id="site-nav">${sidebarMenu}</nav>`
      : ''
  const navToggle = hasMenu
    ? `<button class="nav-toggle" data-action="toggle-nav" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav" title="Menu">${BURGER_ICON}</button>`
    : ''
  const variantCycle = site.themePicker !== false
    ? `<button class="variant-cycle" data-action="cycle-variant" aria-label="Cycle theme variant" title="Cycle theme">◈</button>`
    : ''

  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="${esc(site.title || 'Home')}">
        <span class="brand-mark" aria-hidden="true">${avatar ? `<img src="${esc(avatar)}" alt="">` : '⚡'}</span>
        <span class="brand-name">${esc(site.title || 'JPROT')}</span>
      </a>
      ${navHtml}
      <div class="header-actions">
        ${navToggle}
        <button class="search-toggle" data-action="search" aria-label="Search" title="Search">${SEARCH_ICON}</button>
        ${variantCycle}
        <button class="theme-toggle" data-action="toggle-theme" aria-label="Toggle theme" title="Toggle theme">◐</button>
      </div>
    </header>
  `
}