function isProductPage(value) {
  try {
    const url = new URL(value)
    return url.origin === 'https://crochetmaker.pocketsflow.com' &&
      /^\/[a-z0-9-]+\/?$/i.test(url.pathname) && !/^\/checkout\/?$/i.test(url.pathname)
  } catch {
    return false
  }
}

const normalize = value => String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function matchesProduct(product, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  const fields = [product.shortName, product.es?.shortName, product.subtitle, product.es?.subtitle, product.name, product.category, product.description, product.es?.name,
    product.es?.category, product.es?.description].filter(Boolean)
  const text = normalize(fields.join(' '))
  return words.every(word => text.includes(word))
}

export function getCollections(products) {
  const grouped = new Map()
  for (const product of products) {
    const key = product.category
    if (!grouped.has(key)) grouped.set(key, { name: key, es: product.es?.category, image: product.image, count: 0 })
    grouped.get(key).count += 1
  }
  return [...grouped.values()]
}

export function readCatalog(payload) {
  const products = Array.isArray(payload) ? payload : payload?.products
  if (!Array.isArray(products)) throw new Error('Expected a product array')
  const seen = new Set()
  for (const p of products) {
    if (!p || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug ?? '') || seen.has(p.slug) ||
        !isProductPage(p.productUrl) || !p.name || !p.category || !p.image || !Number.isFinite(p.price) || p.price < 0) {
      throw new Error('Invalid or duplicate catalog entry')
    }
    seen.add(p.slug)
  }
  return products
}
