// scripts/download-custom-design-fonts.mjs
// Downloads woff2 + woff font files from Google Fonts and generates @font-face CSS.

import { createWriteStream, mkdirSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const FONTS_DIR = join(ROOT, 'assets', 'fonts', 'custom-design')
const CSS_OUT  = join(ROOT, 'assets', 'css', 'custom-design-fonts.css')

mkdirSync(FONTS_DIR, { recursive: true })

const GF_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700' +
  '&family=Open+Sans:wght@400;700' +
  '&family=Roboto:wght@400;700' +
  '&family=Merriweather:wght@400;700' +
  '&family=Playfair+Display:wght@400;700' +
  '&family=PT+Serif:wght@400;700' +
  '&family=Dancing+Script:wght@400;700' +
  '&family=Pacifico' +
  '&family=Bebas+Neue' +
  '&family=Oswald:wght@400;700' +
  '&display=swap'

// User-agents: modern Chrome for woff2, old Chrome for woff
const UA_WOFF2 =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const UA_WOFF =
  'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0'

function fetchText(url, ua) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': ua } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location, ua).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => resolve(data))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, { headers: { 'User-Agent': UA_WOFF2 } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
      file.on('error', reject)
    }).on('error', reject)
  })
}

// Parse @font-face blocks from Google Fonts CSS response
function parseFontFaces(css) {
  const blocks = []
  const re = /@font-face\s*\{([^}]+)\}/g
  let m
  while ((m = re.exec(css)) !== null) {
    const block = m[1]
    const get = (prop) => {
      const r = new RegExp(`${prop}:\\s*([^;]+);`)
      const found = r.exec(block)
      return found ? found[1].trim() : ''
    }
    const urlMatch = /url\(([^)]+)\)\s*format\(['"]?([^'"]+)['"]?\)/.exec(block)
    if (!urlMatch) continue
    blocks.push({
      family: get('font-family').replace(/['"]/g, ''),
      style:  get('font-style') || 'normal',
      weight: get('font-weight') || '400',
      display: get('font-display') || 'swap',
      url: urlMatch[1],
      format: urlMatch[2],
    })
  }
  return blocks
}

// Build a stable filename: FamilyName-weight-style.ext
function makeFilename(family, weight, style, ext) {
  const name = family.replace(/\s+/g, '')
  const wLabel = weight === '400' ? 'Regular' : weight === '700' ? 'Bold' : weight
  const sLabel = style === 'italic' ? 'Italic' : ''
  return `${name}-${wLabel}${sLabel}.${ext}`
}

async function main() {
  console.log('Fetching Google Fonts CSS (woff2)…')
  const css2 = await fetchText(GF_URL, UA_WOFF2)
  console.log('Fetching Google Fonts CSS (woff)…')
  const css1 = await fetchText(GF_URL, UA_WOFF)

  const faces2 = parseFontFaces(css2) // woff2
  const faces1 = parseFontFaces(css1) // woff

  // Build a map keyed by family+weight+style for woff lookup
  const woffMap = new Map()
  for (const f of faces1) {
    woffMap.set(`${f.family}|${f.weight}|${f.style}`, f.url)
  }

  console.log(`Found ${faces2.length} woff2 faces, ${faces1.length} woff faces`)

  // De-duplicate: Google Fonts lists multiple unicode-range subsets per weight.
  // Keep only the last entry per family+weight+style (which is always the latin-basic subset).
  const deduped2 = new Map()
  for (const f of faces2) {
    deduped2.set(`${f.family}|${f.weight}|${f.style}`, f)
  }
  const uniqueFaces = [...deduped2.values()]
  console.log(`Deduplicated to ${uniqueFaces.length} unique faces`)

  // Download files
  const downloaded = []
  for (const face of uniqueFaces) {
    const ext2 = 'woff2'
    const ext1 = 'woff'
    const file2 = makeFilename(face.family, face.weight, face.style, ext2)
    const file1 = makeFilename(face.family, face.weight, face.style, ext1)
    const dest2 = join(FONTS_DIR, file2)
    const dest1 = join(FONTS_DIR, file1)

    process.stdout.write(`  ↓ ${file2} … `)
    if (existsSync(dest2)) { process.stdout.write('skip (exists)\n') }
    else { await downloadFile(face.url, dest2); process.stdout.write('done\n') }

    const woffUrl = woffMap.get(`${face.family}|${face.weight}|${face.style}`)
    if (woffUrl) {
      process.stdout.write(`  ↓ ${file1} … `)
      if (existsSync(dest1)) { process.stdout.write('skip (exists)\n') }
      else { await downloadFile(woffUrl, dest1); process.stdout.write('done\n') }
    }

    downloaded.push({ face, file2, file1: woffUrl ? file1 : null })
  }

  // Generate CSS
  const lines = [
    '/**',
    ' * Custom Design page fonts — self-hosted woff2/woff',
    ' * Generated by scripts/download-custom-design-fonts.mjs',
    ' */',
    '',
  ]

  // Group by family so the declarations are tidy
  for (const { face, file2, file1 } of downloaded) {
    const src = file1
      ? `url('~/assets/fonts/custom-design/${file2}') format('woff2'),\n       url('~/assets/fonts/custom-design/${file1}') format('woff')`
      : `url('~/assets/fonts/custom-design/${file2}') format('woff2')`

    lines.push('@font-face {')
    lines.push(`  font-family: '${face.family}';`)
    lines.push(`  font-style: ${face.style};`)
    lines.push(`  font-weight: ${face.weight};`)
    lines.push(`  font-display: swap;`)
    lines.push(`  src: ${src};`)
    lines.push('}')
    lines.push('')
  }

  writeFileSync(CSS_OUT, lines.join('\n'), 'utf8')
  console.log(`\n✓ CSS written to ${CSS_OUT}`)
  console.log(`✓ ${downloaded.length} font families downloaded to ${FONTS_DIR}`)
}

main().catch(err => { console.error(err); process.exit(1) })
