function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export default function Learning(props) {
  const { site, title, subtitle, stages } = props
  const count = (stages || []).reduce((n, s) => n + (s.items || []).length, 0)

  const stageHtml = (stages || []).map((stage, si) => `
    <div class="learning-stage" data-animate>
      <div class="stage-row">
        <h3 class="stage-name">${esc(stage.name || '')}</h3>
        <span class="stage-count">${(stage.items || []).length} builds</span>
      </div>
      <div class="stage-grid">
        ${(stage.items || []).map((it, i) => `
          <div class="learning-card" data-lang="${esc(it.lang || '')}">
            <div class="learning-card-top">
              <span class="learning-card-title">${esc(it.name || '')}</span>
              ${it.demo ? `<a class="learning-demo" href="${esc(it.demo)}" target="_blank" rel="noopener" aria-label="Live demo">Live ↗</a>` : ''}
            </div>
            ${it.desc ? `<span class="learning-card-desc">${esc(it.desc)}</span>` : ''}
            <div class="learning-card-foot">
              <span class="learning-lang">${esc(it.lang || '')}</span>
              <a class="learning-go" href="${esc(it.url || '#')}" target="_blank" rel="noopener">Source ↗</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('\n')

  return `
    <section class="learning-section" id="learning">
      <div class="section-head">
        <h2 class="section-title">${esc(title || 'Learning Journey')}</h2>
        <span class="section-count">${count} early builds</span>
      </div>
      ${subtitle ? `<p class="section-subtitle">${esc(subtitle)}</p>` : ''}
      ${stageHtml}
    </section>
  `
}