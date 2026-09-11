// Generates public/repos.json — every NON-forked public repository on GitHub,
// enriched with extra per-repo data (languages breakdown, topics, contributors,
// latest release, license, activity, counters, pages, archive state).
// Usage: node scripts/gen-repos.mjs
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileP = promisify(execFile)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OWNER = 'Moaaz-i'
const POOL = 10

async function readHidden() {
  try {
    const d = JSON.parse(await readFile(join(root, 'public', 'repos-hidden.json'), 'utf8'))
    return Array.isArray(d) ? d : []
  } catch {
    return []
  }
}

async function gh(args) {
  const { stdout } = await execFileP('gh', ['api', ...args], { maxBuffer: 64 * 1024 * 1024 })
  return JSON.parse(stdout)
}

async function enrich(name) {
  const [langsRaw, contribs, releases] = await Promise.all([
    gh([`repos/${OWNER}/${name}/languages`]),
    gh([`repos/${OWNER}/${name}/contributors?per_page=100`]).catch(() => []),
    gh([`repos/${OWNER}/${name}/releases?per_page=1`]).catch(() => []),
  ])
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

async function main() {
  const listOut = await execFileP('gh', ['api', `users/${OWNER}/repos?per_page=100&sort=updated`, '--paginate'], { maxBuffer: 64 * 1024 * 1024 })
  const raw = JSON.parse(listOut.stdout)
  const rows = raw.filter((r) => !r.fork) // exclude forks
  const hidden = await readHidden()
  const visible = rows.filter((r) => hidden.indexOf(r.name) === -1)
  const repos = []
  for (let i = 0; i < visible.length; i += POOL) {
    const batch = visible.slice(i, i + POOL)
    const enriched = await Promise.all(batch.map((r) => enrich(r.name)))
    batch.forEach((r, j) => {
      const e = enriched[j]
      repos.push({
        name: r.name,
        desc: (r.description || '').replace(/\s+/g, ' ').trim(),
        lang: r.language || '',
        url: r.html_url,
        demo: r.homepage || '',
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

main().catch((err) => { console.error(err.message || err); process.exit(1) })