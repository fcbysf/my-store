import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { collectionPath, displayPrice } from '../lib/catalog'
import ProductGallery from '../ProductGallery'
import { Icon } from '../icons'
import ProductCard from '../components/ProductCard'
import SaveButton from '../components/SaveButton'
import Pair from '../components/Pair'
import MissingPage from './MissingPage'
import { button, heading, primaryButton, productGrid, sectionHeading, shell } from '../components/styles'

const fact = 'inline-flex items-center gap-1.5 text-sm [&_svg]:w-[17px] [&_svg]:text-[#047857]'
const detailRow = 'group border-b border-[#bcebd5] py-3.5'
const detailSummary = 'flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden [&_svg]:shrink-0 group-open:[&_svg]:rotate-45'

function BuyLink({ checkout, storefront, choosePrice, className = "" }) {
  if (!checkout && !storefront) return <button className={button + " cursor-default! border border-[#bcebd5] bg-[#e4f5ec] text-[#375f50] " + className} type="button" disabled>
    <Pair en="Unavailable" es="No disponible"/>
  </button>
  return <a className={primaryButton + " " + className} href={checkout || storefront}>
    <Icon name="bag" size={18}/>
    {checkout || choosePrice ? <Pair en="Buy now" es="Comprar ahora"/> :
      <Pair en="Buy on Fourthwall" es="Comprar en Fourthwall"/>}
  </a>
}

function ProductPresentation({ product, related, checkout, storefront }) {
  const purchase = useRef(null)
  const [showDock, setShowDock] = useState(false)
  const purchaseLink = { checkout, storefront, choosePrice: product.payWhatYouWant }
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setShowDock(!entry.isIntersecting))
    observer.observe(purchase.current)
    return () => observer.disconnect()
  }, [])

  return <main className={shell}>
    <nav className="flex flex-wrap items-center gap-2.5 py-4 text-sm text-[#59736a] md:py-5 [&_a:hover]:underline" aria-label="Breadcrumb / Ruta">
      <Link to="/products"><Pair en="Shop" es="Tienda"/></Link><span aria-hidden="true">›</span>
      <Link to={collectionPath(product.category)}><Pair en={product.category} es={product.es?.category}/></Link>
    </nav>
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] md:gap-[clamp(35px,6.5vw,100px)]">
      <ProductGallery product={product}/>
      <section className="min-w-0 max-w-[620px] wrap-break-word md:pt-2">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-[#047857] uppercase md:mb-3"><span className="h-px w-5 shrink-0 bg-current"/><Pair en={product.category} es={product.es?.category}/></div>
        <h1 className={heading + " text-[clamp(2rem,8vw,4rem)] leading-none tracking-[-.06em] md:text-[clamp(2.6rem,4.45vw,5.1rem)]"}>{product.name}</h1>
        {product.es?.name && <p className="mt-2 text-lg text-[#59736a]" lang="es">{product.es.name}</p>}
        <div className="my-4 text-2xl font-semibold text-[#047857]">{displayPrice(product)} <small className="text-xs font-medium text-[#59736a]">USD</small></div>
        <div className="flex flex-wrap gap-x-4 gap-y-2.5 border-y border-[#bcebd5] py-3">
          <div className={fact}><Icon name="file"/><span><Pair en="Digital PDF" es="PDF digital"/></span></div>
          {product.languages?.length > 0 && <div className={fact}><Icon name="language"/><span>{product.languages.map(l => l === 'Spanish' ? 'Español' : l).join(' + ')}</span></div>}
          {product.level && <div className={fact}><Icon name="level"/><Pair en={product.level} es={product.es?.level}/></div>}
        </div>
        <div className="my-5 flex items-center gap-2" ref={purchase}><BuyLink {...purchaseLink} className="min-h-[50px] min-w-0 flex-1"/><SaveButton product={product} className="size-[50px] border-[#bcebd5] hover:bg-[#e4f8ef]"/></div>
        <div className="space-y-4 leading-relaxed whitespace-pre-line text-[#30574b] [&_p[lang=es]]:text-[#59736a]"><p>{product.description}</p>{product.es?.description && <p lang="es">{product.es.description}</p>}</div>
        <div className="mt-4 border-t border-[#bcebd5] [&_li]:text-sm [&_li]:text-[#59736a] [&_p]:mt-2 [&_p]:text-sm [&_p]:text-[#59736a]">
          {product.includes?.length > 0 && <details className={detailRow} open><summary className={detailSummary}><Pair en="What’s included" es="Qué incluye"/><Icon name="plus" size={17}/></summary>
            <ul className="mt-2.5 list-disc pl-5">{product.includes.map((item,i) => <li key={item}><Pair en={item} es={product.es?.includes?.[i]}/></li>)}</ul>
          </details>}
          <details className={detailRow}><summary className={detailSummary}><Pair en="Format & delivery" es="Formato y entrega"/><Icon name="plus" size={17}/></summary>
            <p>Downloadable crochet pattern in PDF format. Find your order and download details at checkout.</p>
            <p lang="es">Patrón de crochet descargable en PDF. Encontrarás la información del pedido y de la descarga en la página de pago.</p>
          </details>
        </div>
      </section>
    </div>
    {related.length > 0 && <section className="my-12 border-t border-[#bcebd5] pt-6 lg:my-20"><div className="mb-5"><h2 className={sectionHeading}>More to make</h2><p className="mt-1 text-sm text-[#59736a]" lang="es">Más patrones para tejer</p></div>
      <div className={productGrid}>{related.map(p => <ProductCard key={p.slug} product={p}/>)}</div></section>}
    {showDock && (checkout || storefront) && <div data-purchase-dock className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 border-t border-[#bcebd5] bg-[#f1fff8fa] px-4 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))] shadow-lg md:hidden"><div className="shrink-0"><strong>{displayPrice(product)}</strong><small className="block text-xs text-[#59736a]">USD · PDF</small></div><BuyLink {...purchaseLink} className="min-w-0"/></div>}
  </main>
}

export default function ProductPage() {
  const { product, related, checkout, storefront } = useProduct()
  return product ? <ProductPresentation key={product.slug} {...{product, related, checkout, storefront}}/> : <MissingPage/>
}
