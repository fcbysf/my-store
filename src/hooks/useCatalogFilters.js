import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useWishlist } from '../context/WishlistContext'
import { useLanguage } from '../context/LanguageContext'
import { matchesProduct } from '../lib/catalog'

const compare = {
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
}

export function useCatalogFilters() {
  const { language } = useLanguage()
  const { products } = useCatalog()
  const { saved } = useWishlist()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const query = params.get('q') || ''
  const onlySaved = params.get('saved') === '1'
  const order = params.get('sort')
  const sort = order === 'name' || Object.hasOwn(compare, order) ? order : 'featured'
  const results = useMemo(() => {
    const items = products.filter(p =>
      (!category || p.category === category) && (!onlySaved || saved.has(p.slug)) && matchesProduct(p, query))
    if (sort === 'name') {
      const name = p => (language === 'es' && (p.es?.shortName || p.es?.name)) || p.shortName || p.name
      return items.sort((a, b) => name(a).localeCompare(name(b), language))
    }
    return sort === 'featured' ? items : items.sort(compare[sort])
  }, [products, saved, category, query, onlySaved, sort, language])

  function change(key, value) {
    const next = new URLSearchParams(params)
    if (value && !(key === 'sort' && value === 'featured')) next.set(key, value)
    else next.delete(key)
    setParams(next, { preventScrollReset: true })
  }
  return { category, query, onlySaved, sort, results, change }
}
