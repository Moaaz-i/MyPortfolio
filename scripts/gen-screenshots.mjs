// Captures a screenshot of every live demo URL (real deployed apps) and ties
// them to the portfolio:
//   - repos.json entries get a `shot` path (public/shots/<repo>.png)
//   - featured project frontmatter gets a real `cover` image
// Library / repo-page links (github.com, no homepage) are skipped.
// Usage: node scripts/gen-screenshots.mjs
import { spawn } from 'node:child_process'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(root, 'public')
const SHOTS = join(PUBLIC, 'shots')
const PROJECTS_DIR = join(root, 'content', 'projects')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const CPORT = 9388
const VIEWPORT = { width: 1280, height: 900 }

function slug(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function isRealSite(url) {
  if (!/^https?:\/\//i.test(url)) return false
  const host = url.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase()
  return !/^(www\.)?github\.com$/.test(host) // repo pages are libraries, not apps
}

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

async function readFrontmatter(raw) {
  const m = String(raw).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { fm: {}, rest: String(raw) }
  const fm = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2].trim()
  }
  return { fm, rest: String(raw).slice(m[0].length) }
}

function setCover(raw, cover) {
  const lines = String(raw).split(/\r?\n/)
  let inside = false
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') { inside = !inside; continue }
    if (inside && /^cover:\s*/.test(lines[i])) { lines[i] = `cover: ${cover}`; return lines.join('\n') }
  }
  // No cover line → insert right after the opening `---` (preserve order).
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') { lines.splice(i + 1, 0, `cover: ${cover}`); return lines.join('\n') }
  }
  return '---\n' + `cover: ${cover}` + '\n---\n' + raw
}

async function main() {
  const repos = JSON.parse(await readFile(join(PUBLIC, 'repos.json'), 'utf8'))
  const byUrl = new Map() // url -> { repos: [name], projects: [slug] }

  for (const r of repos) {
    if (isRealSite(r.demo)) {
      if (!byUrl.has(r.demo)) byUrl.set(r.demo, { repos: [], projects: [] })
      byUrl.get(r.demo).repos.push(r.name)
    }
  }
  for (const f of await readdir(PROJECTS_DIR).catch(() => [])) {
    if (!f.endsWith('.md')) continue
    const { fm } = await readFrontmatter(await readFile(join(PROJECTS_DIR, f), 'utf8'))
    if (isRealSite(fm.demo)) {
      if (!byUrl.has(fm.demo)) byUrl.set(fm.demo, { repos: [], projects: [] })
      byUrl.get(fm.demo).projects.push(f.replace(/\.md$/, ''))
    }
  }

  const queue = [...byUrl.entries()]
  console.log(`capturing ${queue.length} real demo(s)…`)
  if (!queue.length) { console.log('nothing to capture.'); return }
  await mkdir(SHOTS, { recursive: true })

  const chrome = spawn(CHROME, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    `--remote-debugging-port=${CPORT}`,
    '--user-data-dir=' + join(process.env.TMPDIR || '/tmp', 'shot-chrome-' + Date.now()),
    'about:blank',
  ], { stdio: 'ignore' })

  for (let i = 0; i < 60; i++) {
    await sleep(200)
    try { if ((await (await fetch(`http://127.0.0.1:${CPORT}/json/version`)).json()).webSocketDebuggerUrl) break } catch { /* not up yet */ }
  }
  const pages = await (await fetch(`http://127.0.0.1:${CPORT}/json/list`)).json()
  const ws = new WebSocket(pages.find((p) => p.type === 'page').webSocketDebuggerUrl)
  let msgId = 0
  const pend = new Map()
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++msgId
    pend.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })
  await new Promise((res) => { ws.onopen = res })
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data)
    if (m.id && pend.has(m.id)) {
      const p = pend.get(m.id)
      pend.delete(m.id)
      m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result)
    }
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: VIEWPORT.width, height: VIEWPORT.height, deviceScaleFactor: 1, mobile: false,
  })

  const shotMap = new Map() // `repo:<name>` | `proj:<slug>` → /shots/<file>.png
  let ok = 0
  for (const [url, meta] of queue) {
    try {
      await send('Page.navigate', { url })
      for (let i = 0; i < 40; i++) {
        await sleep(250)
        const st = await send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true }).catch(() => ({}))
        if (st?.result?.value === 'complete') break
      }
      await sleep(3500)
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      const buf = Buffer.from(res.data, 'base64')
      for (const name of meta.repos) {
        const file = `${slug(name)}.png`
        await writeFile(join(SHOTS, file), buf)
        shotMap.set(`repo:${name}`, `/shots/${file}`)
      }
      for (const s of meta.projects) {
        const file = `${slug(s)}.png`
        await writeFile(join(SHOTS, file), buf)
        shotMap.set(`proj:${s}`, `/shots/${file}`)
      }
      ok++
      console.log(`  ✔ ${url}`)
    } catch (e) {
      console.log(`  ✖ failed ${url}: ${e.message}`)
    }
  }
  ws.close()
  chrome.kill()

  for (const r of repos) {
    const shot = shotMap.get(`repo:${r.name}`)
    if (shot) { r.shot = shot; delete r.generatedShot }
  }
  await writeFile(join(PUBLIC, 'repos.json'), JSON.stringify(repos, null, 2) + '\n', 'utf8')

  for (const f of await readdir(PROJECTS_DIR).catch(() => [])) {
    if (!f.endsWith('.md')) continue
    const shot = shotMap.get(`proj:${f.replace(/\.md$/, '')}`)
    if (!shot) continue
    const file = join(PROJECTS_DIR, f)
    const raw = await readFile(file, 'utf8')
    if (raw.includes(`cover: ${shot}`)) continue
    await writeFile(file, setCover(raw, shot), 'utf8')
    console.log(`  cover → ${f}: ${shot}`)
  }

  console.log(`done — ${ok}/${queue.length} captured`)
}

main().catch((e) => { console.error(e?.message || e); process.exit(1) })