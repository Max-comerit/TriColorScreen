// scripts/download-app-fonts.mjs
// Downloads woff2 font files for app-wide fonts from Google Fonts
// and regenerates assets/css/fonts.css.
//
// App-wide fonts (matches tailwind.config.ts fontFamily):
//   DM Sans                →  font-display  (400, 500, 600, 700)
//   Inter                  →  font-body     (400, 700)

import { createWriteStream, mkdirSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')
const FONTS_DIR = join(ROOT, 'assets', 'fonts')
const CSS_OUT   = join(ROOT, 'assets', 'css', 'fonts.css')

mkdirSync(FONTS_DIR, { recursive: true })

const GF_URL =
  'https://fonts.googleapis.com/css2' +
  '?family=DM+Sans:wght@600;700' +
  '&family=Inter:wght@400;700' +
  '&display=swap'

// User-agent: modern Chrome for woff2
const UA_WOFF2 =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

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
      family:  get('font-family').replace(/['"]/g, ''),
      style:   get('font-style') || 'normal',
      weight:  get('font-weight') || '400',
      display: get('font-display') || 'swap',
      url:     urlMatch[1],
      format:  urlMatch[2],
    })
  }
  return blocks
}

// Semantic weight labels matching Google Fonts naming conventions
const WEIGHT_LABELS = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
}

// Build a stable filename.
// Variable fonts: FamilyName[wght].ext (OpenType bracket notation)
// Static fonts:   FamilyName-WeightLabel[Italic].ext
function makeFilename(family, weight, style, ext, isVariable = false) {
  const name = family.replace(/\s+/g, '')
  if (isVariable) {
    const sLabel = style === 'italic' ? '-Italic' : ''
    return `${name}[wght]${sLabel}.${ext}`
  }
  const wLabel = WEIGHT_LABELS[weight] ?? weight
  const sLabel = style === 'italic' ? 'Italic' : ''
  return `${name}-${wLabel}${sLabel}.${ext}`
}

async function main() {
  console.log('Fetching Google Fonts CSS (woff2)…')
  const css2 = await fetchText(GF_URL, UA_WOFF2)

  const faces2 = parseFontFaces(css2)

  console.log(`Found ${faces2.length} woff2 faces`)

  // De-duplicate: Google Fonts returns multiple unicode-range subsets per weight.
  // Keep only the last entry per family+weight+style (the latin-basic subset).
  const deduped2 = new Map()
  for (const f of faces2) {
    deduped2.set(`${f.family}|${f.weight}|${f.style}`, f)
  }
  const uniqueFaces = [...deduped2.values()]
  console.log(`Deduplicated to ${uniqueFaces.length} unique faces`)

  const variantKey = (f) => `${f.family}|${f.style}|${f.url}`
  const byVariant = new Map()
  for (const f of uniqueFaces) {
    const key = variantKey(f)
    if (!byVariant.has(key)) byVariant.set(key, { face: f, weights: [] })
    byVariant.get(key).weights.push(Number(f.weight))
  }

  // For groups that share a URL, download to a temp file and check for fvar table.
  // We do this by spawning python inline so we don't need a separate script.
  const { execFileSync } = await import('child_process')
  const PYTHON = 'C:\\Users\\Andreas\\AppData\\Local\\Programs\\Python\\Python312\\python.exe'

  // Returns the wght axis range from fvar as 'min max', or null if static.
  function getWeightAxis(filePath) {
    try {
      const result = execFileSync(PYTHON, [
        '-c',
        `from fontTools.ttLib import TTFont; f=TTFont(r'${filePath}'); axes=[a for a in f.get('fvar',type('',(),{'axes':[]})()).axes if a.axisTag=='wght']; print(f'{int(axes[0].minValue)} {int(axes[0].maxValue)}') if axes else print('')`
      ], { encoding: 'utf8', timeout: 10000 })
      return result.trim() || null
    } catch { return null }
  }

  const collapsedFaces = []
  for (const { face, weights } of byVariant.values()) {
    weights.sort((a, b) => a - b)
    if (weights.length === 1) {
      collapsedFaces.push({ face, weightRange: String(weights[0]), isVariable: false, minWeight: weights[0] })
      continue
    }
    const tmpFile = join(FONTS_DIR, `_tmp_check_${face.family.replace(/\s/g,'')}.woff2`)
    process.stdout.write(`  Checking if ${face.family} is variable… `)
    await downloadFile(face.url, tmpFile)
    const axisRange = getWeightAxis(tmpFile)
    const { unlinkSync } = await import('fs')
    unlinkSync(tmpFile)
    if (axisRange) {
      console.log(`variable (axis ${axisRange})`)
      collapsedFaces.push({ face, weightRange: axisRange, isVariable: true, minWeight: weights[0] })
    } else {
      console.log('static — keeping separate weights')
      for (const w of weights) {
        collapsedFaces.push({ face: { ...face, weight: String(w) }, weightRange: String(w), isVariable: false, minWeight: w })
      }
    }
  }

  // Download files
  const downloaded = []
  for (const { face, weightRange, isVariable } of collapsedFaces) {
    const file2 = isVariable
      ? makeFilename(face.family, '', face.style, 'woff2', true)
      : makeFilename(face.family, face.weight, face.style, 'woff2', false)
    const dest2 = join(FONTS_DIR, file2)

    process.stdout.write(`  ↓ ${file2}${isVariable ? ` (variable ${weightRange})` : ''} … `)
    if (existsSync(dest2)) { process.stdout.write('skip (exists)\n') }
    else { await downloadFile(face.url, dest2); process.stdout.write('done\n') }

    downloaded.push({ face, file2, weightRange })
  }

  // Generate fonts.css
  const lines = [
    '/**',
    ' * App-wide font declarations — self-hosted woff2',
    ' * Generated by scripts/download-app-fonts.mjs',
    ' *',
    ' * DM Sans  →  font-display  (Tailwind)  weights: 600, 700',
    ' * Inter    →  font-body     (Tailwind)  weights: 400, 700',
    ' */',
    '',
  ]

  for (const { face, file2, weightRange } of downloaded) {
    const src = `url('~/assets/fonts/${file2}') format('woff2')`

    lines.push('@font-face {')
    lines.push(`  font-family: '${face.family}';`)
    lines.push(`  font-style: ${face.style};`)
    lines.push(`  font-weight: ${weightRange};`)
    lines.push(`  font-display: swap;`)
    lines.push(`  src: ${src};`)
    lines.push('}')
    lines.push('')
  }

  writeFileSync(CSS_OUT, lines.join('\n'), 'utf8')
  console.log(`\n✓ CSS written to ${CSS_OUT}`)
  console.log(`✓ ${downloaded.length} font faces downloaded to ${FONTS_DIR}`)
}

main().catch(err => { console.error(err); process.exit(1) })
