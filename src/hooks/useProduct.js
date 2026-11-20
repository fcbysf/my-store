import { useParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { httpsUrl } from '../lib/catalog'

export function useProduct() {
  const { slug } = useParams()
  const { bySlug, products } = useCatalog()
  const product = bySlug.get(slug)
  if (!product) return { product: null, related: [] }
  const related = products.filter(other => other.slug !== slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4)
  const checkout = httpsUrl(product.checkoutUrl)
  const storefront = httpsUrl(product.productUrl)
  return { product, related, checkout, storefront }
}
