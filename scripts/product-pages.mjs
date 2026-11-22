
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { join } from 'node:path'
import { readCatalog } from '../src/lib/catalog.js'

const products = readCatalog(JSON.parse(await readFile('public/products.json', 'utf8')))
const template = await readFile('dist/index.html', 'utf8')
const escape = (text) => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

async function page(path, title, description) {
  const directory = join('dist', path)
  await mkdir(directory, { recursive: true })
  const html = template.replace(/<title>.*?<\/title>/, () => '<title>' + escape(title) + '</title>')
    .replace(/(<meta name="description" content=")[^"]*(")/, (_, start, end) => start + escape(description) + end)
  await writeFile(join(directory, 'index.html'), html)
}

for (const product of products) {
  const responsiveImages = (product.imageSrcSet || '').split(',').filter(Boolean).map(candidate => candidate.trim().split(/\s+/)[0])
  for (const src of [product.image, ...responsiveImages]) {
    if (typeof src !== 'string' || !src.trim()) throw new Error('Missing image URL for ' + product.slug)
    if (src.startsWith('/')) await access(join('public', src))
  }
}
await page('products', 'Patrones de crochet · Crochet Maker', 'Explora la colección completa de patrones de crochet.')
await writeFile('dist/404.html', template)
