function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export default function Footer(props) {
  const { site, nav } = props
  const year = new Date().getFullYear()
  const links = (nav || []).filter((n) => n.url && n.url !== '/')
  const social = site.sameAs || []
  const socialHtml = social.length ? `
      <div class="footer-social">
        ${social.map((s) => `<a class="footer-social-link" href="${esc(s)}" target="_blank" rel="noopener">${esc(new URL(s).hostname.replace('www.', ''))} ↗</a>`).join('')}
      </div>` : ''

  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-mark" aria-hidden="true">⚡</span>
          <div>
            <div class="footer-name">${esc(site.title || 'JPROT')}</div>
            <div class="footer-tagline">${esc(site.tagline || '')}</div>
          </div>
        </div>
        ${links.length ? `
          <nav class="footer-nav">
            ${links.map((n) => `<a href="${esc(n.url)}" class="footer-link">${esc(n.label)}</a>`).join('')}
          </nav>` : ''}
        ${socialHtml}
      </div>
      <div class="footer-bottom">
        © ${year} ${esc(site.title || 'JPROT')} · Built with ${esc(site.footerText ? 'JPROT' : 'JPROT')}
        ${site.email ? `<span class="footer-sep">·</span> <a class="footer-email" href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : ''}
      </div>
    </footer>
  `
}