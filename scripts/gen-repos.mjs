// Generates public/repos.json — every NON-forked public repository on GitHub,
// enriched with extra per-repo data (languages breakdown, topics, contributors,
// latest release, license, activity, counters, pages, archive state).
// Usage: node scripts/gen-repos.mjs
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileP = promisify(execFile)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OWNER = 'Moaaz-i'
const POOL = 10
const TOKEN = process.env.GITHUB_TOKEN || ''
const API = 'https://api.github.com'
const headers = {
  'User-Agent': 'MozPortfolio-gen',
  Accept: 'application/vnd.github+json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
}

// Derive the live demo URL purely from GitHub's own repo fields — the
// `homepage` setting when set, otherwise the GitHub Pages site. Nothing is
// hand-written here.
function liveDemo(r) {
  if (r.homepage && /^https?:\/\//i.test(String(r.homepage))) {
    const h = String(r.homepage).replace(/^https?:\/\//i, '').split('/')[0].toLowerCase()
    if (h.indexOf('github.com') === -1) return r.homepage
  }
  if (r.has_pages && !/\.github\.io\/?$/.test(String(r.name || ''))) {
    return `https://${OWNER}.github.io/${String(r.name)}/`
  }
  // user/org site repos (owner.github.io) live at the root, not a /repo/ path
  if (r.has_pages && /\.github\.io\/?$/i.test(String(r.name || ''))) {
    return `https://${String(r.name).replace(/[\\/]+$/, '')}/`
  }
  return ''
}

async function readHidden() {
  try {
    const d = JSON.parse(await readFile(join(root, 'public', 'repos-hidden.json'), 'utf8'))
    return Array.isArray(d) ? d : []
  } catch {
    return []
  }
}

async function api(path) {
  const res = await fetch(`${API}${path}`, { headers })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  return res.json()
}

async function enrichApi(name) {
  const [langsRaw, contribs, releases] = await Promise.all([
    api(`/repos/${OWNER}/${name}/languages`),
    api(`/repos/${OWNER}/${name}/contributors?per_page=100`).catch(() => []),
    api(`/repos/${OWNER}/${name}/releases?per_page=1`).catch(() => []),
  ])
  return buildEnrich(langsRaw, contribs, releases)
}

async function enrichGh(name) {
  const [langsRaw, contribs, releases] = await Promise.all([
    gh(`repos/${OWNER}/${name}/languages`),
    gh(`repos/${OWNER}/${name}/contributors?per_page=100`).catch(() => []),
    gh(`repos/${OWNER}/${name}/releases?per_page=1`).catch(() => []),
  ])
  return buildEnrich(langsRaw, contribs, releases)
}

async function gh(args) {
  const argList = Array.isArray(args) ? args : [args]
  const { stdout } = await execFileP('gh', ['api', ...argList], { maxBuffer: 64 * 1024 * 1024 })
  return JSON.parse(stdout)
}

function buildEnrich(langsRaw, contribs, releases) {
  const totalBytes = Object.values(langsRaw).reduce((a, b) => a + b, 0)
  const topLangs = Object.entries(langsRaw)
    .map(([lang, bytes]) => ({ lang, pct: totalBytes ? Math.round((bytes / totalBytes) * 1000) / 10 : 0 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3)
  const latestRelease = releases[0]
    ? { tag: releases[0].tag_name, name: releases[0].name, published: releases[0].published_at || releases[0].created_at }
    : null
  return { topLangs, contributors: Array.isArray(contribs) ? contribs.length : 0, latestRelease }
}

async function hasGh() {
  try {
    await execFileP('gh', ['--version'])
    return true
  } catch {
    return false
  }
}

async function main() {
  // Prefer the authenticated `gh` CLI locally (fast, high rate limit, full
  // enrichment). On CI without gh we use the REST API; a GITHUB_TOKEN enables
  // the same per-repo enrichment there.
  const ghAvailable = await hasGh()
  const raw = []
  if (ghAvailable) {
    const listOut = await execFileP('gh', ['api', `users/${OWNER}/repos?per_page=100&sort=updated`, '--paginate'], { maxBuffer: 64 * 1024 * 1024 })
    raw.push(...JSON.parse(listOut.stdout))
  } else {
    for (let page = 1; ; page++) {
      const rows = await api(`/users/${OWNER}/repos?per_page=100&page=${page}&sort=updated`)
      if (!Array.isArray(rows) || !rows.length) break
      raw.push(...rows)
      if (rows.length < 100) break
    }
  }
  const rows = raw.filter((r) => !r.fork) // exclude forks
  const hidden = await readHidden()
  const visible = rows.filter((r) => hidden.indexOf(r.name) === -1)
  const emptyEnrich = { topLangs: [], contributors: 0, latestRelease: null }
  // Per-repo enrichment costs 3 API calls/repo; without auth there's no budget
  // for that on CI, so enrich only when gh or a token is available.
  const canEnrich = ghAvailable || Boolean(TOKEN)
  const enrichOne = ghAvailable ? enrichGh : enrichApi
  const repos = []
  for (let i = 0; i < visible.length; i += POOL) {
    const batch = visible.slice(i, i + POOL)
    const enriched = canEnrich
      ? await Promise.all(batch.map((r) => enrichOne(r.name)))
      : batch.map(() => emptyEnrich)
    batch.forEach((r, j) => {
      const e = enriched[j]
      repos.push({
        name: r.name,
        desc: (r.description || '').replace(/\s+/g, ' ').trim(),
        lang: r.language || '',
        url: r.html_url,
        demo: liveDemo(r),
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        openIssues: r.open_issues_count || 0,
        sizeKb: r.size || 0,
        license: r.license ? r.license.spdx_id || r.license.name || '' : '',
        topics: Array.isArray(r.topics) ? r.topics : [],
        archived: !!r.archived,
        hasPages: !!r.has_pages,
        defaultBranch: r.default_branch || '',
        createdAt: r.created_at || '',
        pushedAt: r.pushed_at || '',
        updatedAt: r.updated_at || '',
        ...e,
      })
    })
    console.log(`fetching… ${Math.min(i + POOL, visible.length)}/${visible.length}`)
  }

  const dir = join(root, 'public')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'repos.json'), JSON.stringify(repos, null, 2) + '\n', 'utf8')
  const skipped = raw.length - visible.length
  console.log(`wrote public/repos.json — ${repos.length} original repos (${skipped} excluded: forks + hidden)`)
}

// Fail hard on a genuinely missing source, but degrade gracefully: if GitHub is
// unreachable/rate-limited during a build we keep the last committed snapshot so
// deployments never break just because the API reset.
main().catch((err) => {
  const stale = join(root, 'public', 'repos.json')
  if (existsSync(stale)) {
    console.error(`[gen-repos] ${err.message} — keeping existing public/repos.json`)
    process.exit(0)
  }
  console.error(err.message || err)
  process.exit(1)
})