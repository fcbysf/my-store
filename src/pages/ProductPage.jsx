import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { collectionPath, displayPrice } from '../lib/catalog'
import { useLanguage } from '../context/LanguageContext'
import ProductGallery from '../ProductGallery'
import { Icon } from '../icons'
import ProductCard from '../components/ProductCard'
import Pair from '../components/Pair'
import MissingPage from './MissingPage'
import { button, primaryButton, productGrid, sectionHeading, shell } from '../components/styles'

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
      new URL(storefront).hostname.endsWith('.pocketsflow.com') ? <Pair en="Buy on Pocketsflow" es="Comprar en Pocketsflow"/> :
        <Pair en="Buy on Fourthwall" es="Comprar en Fourthwall"/>}
  </a>
}

function ProductPresentation({ product, related, checkout, storefront }) {
  const { t, language } = useLanguage()
  const purchase = useRef(null)
  const [showDock, setShowDock] = useState(false)
  const purchaseLink = { checkout, storefront, choosePrice: product.payWhatYouWant }
  const hasSales = Number.isSafeInteger(product.salesCount) && product.salesCount > 0
  const pdfLabel = product.languages?.length ? 'PDF · ' + product.languages.map(l => l === 'English' ? t('English','Inglés') : l === 'Spanish' ? t('Spanish','Español') : l).join(' + ') : t('Digital PDF','PDF digital')
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setShowDock(!entry.isIntersecting && entry.boundingClientRect.bottom < 0))
    observer.observe(purchase.current)
    return () => observer.disconnect()
  }, [])

  return <main className={shell}>
    <nav className="flex flex-wrap items-center gap-2.5 py-4 text-sm text-[#59736a] md:py-5 [&_a:hover]:underline" aria-label={t('Breadcrumb','Ruta')}>
      <Link to="/products"><Pair en="Shop" es="Tienda"/></Link><span aria-hidden="true">›</span>
      <Link to={collectionPath(product.category)}><Pair en={product.category} es={product.es?.category}/></Link>
    </nav>
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] md:gap-[clamp(35px,6.5vw,100px)]">
      <ProductGallery product={product}/>
      <section className="min-w-0 max-w-[620px] wrap-break-word md:pt-2">
        <div className="product-facts">
          {hasSales
            ? <span className={fact}><Icon name="bag"/>{product.salesCount} {product.salesCount === 1 ? t('sale','venta') : t('sales','ventas')}</span>
            : <span className={fact}><Icon name="file"/>{pdfLabel}</span>}
          {product.level && <span className={fact}><Icon name="level"/>{t(product.level, product.es?.level)}</span>}
        </div>
        <h1 className="product-title">{t(product.displayTitle || product.name, product.es?.displayTitle || product.es?.name)}</h1>
        {product.subtitle && <p className="product-subtitle">{t(product.subtitle, product.es?.subtitle)}</p>}
        <div className="purchase-area" ref={purchase}>
          <div className="product-price">{displayPrice(product, language)} <small>USD</small></div>
          <BuyLink {...purchaseLink} className="min-h-[50px] w-full"/>
          {product.fourthwallVariantId && <a
            className={button + " mt-2 min-h-[50px] w-full bg-[#ffc439] text-[#003087] hover:bg-[#f4b626] focus-visible:outline-[#003087]"}
            href={'https://crochet-art-hwz-shop.fourthwall.com/cart/checkout?products=' + encodeURIComponent(product.fourthwallVariantId) + ':1&currency=USD'}>
            <img src="/images/paypal-classic.svg" width="104" height="28" alt={t('Pay with PayPal', 'Pagar con PayPal')}/>
          </a>}
          <p className="purchase-note">{t('Digital PDF only. No physical item.', 'Solo PDF digital. No se envía ningún artículo físico.')}</p>
        </div>
        <p className="leading-relaxed whitespace-pre-line text-[#30574b]">{t(product.description, product.es?.description)}</p>
        <div className="mt-4 border-t border-[#bcebd5] [&_li]:text-sm [&_li]:text-[#59736a] [&_p]:mt-2 [&_p]:text-sm [&_p]:text-[#59736a]">
          {product.includes?.length > 0 && <details className={detailRow} open><summary className={detailSummary}><Pair en="What’s included" es="Qué incluye"/><Icon name="plus" size={17}/></summary>
            <ul className="mt-2.5 list-disc pl-5">{product.includes.map((item,i) => <li key={item}><Pair en={item} es={product.es?.includes?.[i]}/></li>)}</ul>
          </details>}
          <details className={detailRow}><summary className={detailSummary}><Pair en="Format & delivery" es="Formato y entrega"/><Icon name="plus" size={17}/></summary>
            {hasSales && <p>{pdfLabel}</p>}
            <p>{t('Your receipt email links to your digital purchase.', 'El correo de confirmación incluye un enlace a tu compra digital.')}</p>
          </details>
        </div>
      </section>
    </div>
    {related.length > 0 && <section className="my-12 border-t border-[#bcebd5] pt-6 lg:my-20"><div className="mb-5"><h2 className={sectionHeading}>{t('More to make','Más patrones para tejer')}</h2></div>
      <div className={productGrid}>{related.map(p => <ProductCard key={p.slug} product={p}/>)}</div></section>}
    {showDock && (checkout || storefront) && <div data-purchase-dock className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 border-t border-[#bcebd5] bg-[#f1fff8fa] px-4 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))] shadow-lg md:hidden"><div className="shrink-0"><strong>{displayPrice(product,language)}</strong><small className="block text-xs text-[#59736a]">USD · PDF</small></div><BuyLink {...purchaseLink} className="min-w-0"/></div>}
  </main>
}

export default function ProductPage() {
  const { product, related, checkout, storefront } = useProduct()
  return product ? <ProductPresentation key={product.slug} {...{product, related, checkout, storefront}}/> : <MissingPage/>
}
