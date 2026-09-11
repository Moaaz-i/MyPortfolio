import { writeFileSync } from 'node:fs'

const CATEGORY = {
  flash:     { g: ['#3b0764', '#4f46e5', '#0ea5e9'], i: '🛡️' },
  jprot:     { g: ['#1e1b4b', '#4f46e5', '#c084fc'], i: '⚡' },
  velociradix: { g: ['#7f1d1d', '#dc2626', '#fb923c'], i: '🚀' },
  cronflex:  { g: ['#065f46', '#059669', '#34d399'], i: '⛰' },
  aeroci:    { g: ['#0c4a6e', '#0284c7', '#38bdf8'], i: '✈️' },
  velociforge: { g: ['#581c87', '#7c3aed', '#a78bfa'], i: '🔨' },
  flaredom:  { g: ['#7c2d12', '#ea580c', '#fbbf24'], i: '🔥' },
  microtaskx: { g: ['#134e4a', '#0d9488', '#2dd4bf'], i: '⚙️' },
  codinam:   { g: ['#1e3a5f', '#2563eb', '#60a5fa'], i: '⌨️' },
  ultra1602: { g: ['#3f3f46', '#71717a', '#a1a1aa'], i: '🖥️' },
  livedac:   { g: ['#4c0519', '#be123c', '#f472b6'], i: '🎛️' },
  socialapp: { g: ['#052e16', '#16a34a', '#86efac'], i: '🌐' },
}

const FALLBACK = { g: ['#1e1b4b', '#4f46e5', '#7b8cff'], i: '⚡' }

const files = {
  'flash.svg': 'FLASH',
  'jprot.svg': 'JPROT',
  'velociradix.svg': 'VELOCIRADIX',
  'cronflex.svg': 'CRONFLEX',
  'aeroci.svg': 'AEROCI',
  'velociforge.svg': 'VELOCIFORGE',
  'flaredom.svg': 'FLAREDOM',
  'microtaskx.svg': 'MICROTASKX',
  'codinam.svg': 'CODINAM',
  'ultra1602.svg': 'Ultra1602Ultimate',
  'livedac.svg': 'LiveDAC',
  'social-app.svg': 'Social App',
}

function svg(name, meta, sub) {
  const [c1, c2, c3] = meta.g
  const size = name.length
  let fsize = 46
  if (size > 12) fsize = 38
  if (name.toLowerCase().startsWith('ultra16')) fsize = 30
  if (name.toLowerCase().startsWith('social app')) fsize = 40
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="14%" r="40%" stop-color="#ffffff" stop-opacity="0.22">
      <animate attributeName="stop-opacity" values="0.22;0.38;0.22" dur="6s" repeatCount="indefinite"/>
    </radialGradient>
    <style>
      text { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
      .sub { fill: rgba(255,255,255,.82); letter-spacing: .28em; font-size: 15px; font-weight: 600; }
      .name { fill: #ffffff; font-weight: 800; letter-spacing: .04em; }
    </style>
  </defs>
  <rect width="800" height="450" fill="url(#g)"/>
  <rect width="800" height="450" fill="url(#glow)"/>
  <g opacity="0.10" fill="none" stroke="#ffffff" stroke-width="2">
    <circle cx="640" cy="80" r="150"/>
    <circle cx="120" cy="400" r="180"/>
    <path d="M0 380 Q 200 320 400 380 T 800 380 V450 H0 Z"/>
  </g>
  <g opacity="0.9">
    <text x="62" y="118" class="sub">MOAAZ YAHIA ZAKARIA</text>
    <text x="58" y="236" class="name" font-size="${fsize}">${name}</text>
  </g>
</svg>
`
}

for (const [file, name] of Object.entries(files)) {
  const key = file.replace('.svg', '')
  const meta = CATEGORY[key] || FALLBACK
  writeFileSync(`/Users/moaaz/Desktop/MozPortfolio/public/covers/${file}`, svg(name, meta))
}
console.log('Generated', Object.keys(files).length, 'cover SVGs')