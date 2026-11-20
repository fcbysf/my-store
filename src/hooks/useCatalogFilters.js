import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useWishlist } from '../context/WishlistContext'
import { matchesProduct } from '../lib/catalog'

const compare = {
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name)
}

export function useCatalogFilters() {
  const { products } = useCatalog()
  const { saved } = useWishlist()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const query = params.get('q') || ''
  const onlySaved = params.get('saved') === '1'
  const order = params.get('sort')
  const sort = Object.hasOwn(compare, order) ? order : 'featured'
  const results = useMemo(() => {
    const items = products.filter(p =>
      (!category || p.category === category) && (!onlySaved || saved.has(p.slug)) && matchesProduct(p, query))
    return sort === 'featured' ? items : items.sort(compare[sort])
  }, [products, saved, category, query, onlySaved, sort])

  function change(key, value) {
    const next = new URLSearchParams(params)
    if (value && !(key === 'sort' && value === 'featured')) next.set(key, value)
    else next.delete(key)
    setParams(next, { preventScrollReset: true })
  }
  return { category, query, onlySaved, sort, results, change }
}
