import React from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import { productPath } from '../lib/catalog'
import { Icon } from '../icons'
import Pair from '../components/Pair'
import ProductCard from '../components/ProductCard'
import { emptyState, heading, primaryButton, productGrid, sectionHeading, shell } from '../components/styles'

const collectionButton = 'inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-full border border-[#bcebd5] px-3 py-1.5 text-left text-sm font-medium hover:bg-[#e4f8ef] aria-pressed:border-[#047857] aria-pressed:bg-[#047857] aria-pressed:text-white'

function StudioFeature({ product }) {
  return <section className="mt-4 grid overflow-hidden rounded-2xl border border-[#bcebd5] bg-[#ecfdf5] md:mt-6 md:min-h-[325px] md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:min-h-[370px]" aria-labelledby="studio-title">
    <div className="min-w-0 self-center p-5 text-[#047857] sm:p-8 lg:p-[clamp(32px,3.6vw,62px)]">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"><span className="h-px w-5 bg-current"/><span>English + Español</span></div>
      <h1 id="studio-title" className={heading + " max-w-[12ch] text-[clamp(2.3rem,8vw,3.5rem)] leading-none tracking-[-.055em] md:text-[clamp(3rem,5.5vw,6rem)]"}>The crochet <em className="font-semibold not-italic">pattern shop.</em></h1>
      <p className="mt-3 mb-4 text-sm text-[#476e60] sm:text-base" lang="es">La tienda de patrones de crochet.</p>
      <a className={primaryButton} href="#patterns"><Icon name="bag" size={17}/><Pair en="Shop patterns" es="Ver patrones"/></a>
    </div>
    <Link className="group relative isolate block aspect-[4/3] min-w-0 bg-[#e1f6eb] sm:aspect-[2/1] md:aspect-auto" to={productPath(product)} aria-label={'View pattern / Ver patrón · ' + product.name}>
      <img className="absolute inset-0 -z-10 size-full object-cover object-center motion-safe:transition-transform motion-safe:group-hover:scale-[1.015]" src={product.studioImage || product.image} alt={product.studioImageAlt || product.imageAlt || product.name} fetchPriority="high"/>
      <div className="absolute right-3 bottom-3 left-3 w-fit max-w-[calc(100%-1.5rem)] rounded-lg border border-[#bcebd5] bg-white/95 px-3 py-2 md:right-5 md:bottom-5 md:left-auto"><span className="block text-xs text-[#59736a]"><Pair en="Featured pattern" es="Patrón destacado"/></span>
        <span className="block text-sm font-semibold sm:text-base">{product.name}</span></div>
    </Link>
  </section>
}

export default function CatalogPage({ home = false }) {
  const { featured, collections } = useCatalog()
  const { category, onlySaved, query, sort, results, change } = useCatalogFilters()
  const title = onlySaved ? ['Saved patterns', 'Patrones guardados'] : query ? ['Search results', 'Resultados'] : ['Pattern collection', 'Colección de patrones']
  return <main className={shell}>
    {home && featured && !query && !onlySaved && <StudioFeature product={featured}/>}
    <section className="scroll-mt-4 pt-8 pb-14 lg:pt-12 lg:pb-20" id="patterns" aria-labelledby="catalog-title">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between"><div>
        <h2 id="catalog-title" className={sectionHeading}>{title[0]}</h2>
        <p className="mt-1 text-sm text-[#59736a]" lang="es">{title[1]}</p>
      </div>
      <label className="relative flex min-w-0 items-center gap-2 text-sm text-[#59736a]"><span className="hidden md:inline"><Pair en="Sort" es="Ordenar"/></span>
        <select value={sort} onChange={e => change('sort', e.target.value)} className="min-h-11 w-full min-w-0 cursor-pointer appearance-none rounded-full border border-[#bcebd5] bg-white py-2 pr-9 pl-3 text-base text-[#073d35] sm:w-auto sm:text-sm" aria-label="Sort patterns / Ordenar patrones">
          <option value="featured">Featured / Destacados</option><option value="low">Price / Precio ↑</option>
          <option value="high">Price / Precio ↓</option><option value="name">Name / Nombre A–Z</option>
        </select><span className="pointer-events-none absolute right-3"><Icon name="chevron" size={14}/></span>
      </label></div>
      <div className="mb-5 flex flex-col gap-3 border-b border-[#bcebd5] py-4 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2" role="group" aria-label="Filter by collection / Filtrar por colección">
        <button className={collectionButton} aria-pressed={!category} onClick={() => change('category','')}><Pair en="All" es="Todos"/></button>
        {collections.map(c => <button className={collectionButton + " pl-1.5"} key={c.name} aria-pressed={category === c.name} onClick={() => change('category',c.name)}>
          <img className="size-6 shrink-0 rounded-full object-cover" src={c.image} alt=""/><Pair en={c.name} es={c.es}/>
        </button>)}
      </div><span className="shrink-0 text-sm text-[#59736a]" aria-live="polite">{results.length} <Pair en={results.length === 1 ? 'pattern' : 'patterns'} es={results.length === 1 ? 'patrón' : 'patrones'}/></span></div>
      {query && <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full bg-[#e4f8ef] px-3 py-1 wrap-anywhere">“{query}” <button className="shrink-0 cursor-pointer" aria-label="Clear search / Borrar búsqueda" onClick={() => change('q','')}><Icon name="close" size={15}/></button></p>}
      {results.length > 0 ? <div className={productGrid}>{results.map(p => <ProductCard key={p.slug} product={p}/>)}</div> :
        <div className={emptyState}><span className="flex justify-center"><Icon name={onlySaved ? 'heart' : 'search'} size={30}/></span>
          <h3 className={sectionHeading + " my-3"}><Pair en={onlySaved ? 'No saved matches' : 'No matching patterns'} es={onlySaved ? 'Sin patrones guardados para este filtro' : 'No hay resultados'}/></h3>
          {onlySaved && <p><Pair en="Tap a heart to save a pattern." es="Toca un corazón para guardar un patrón."/></p>}
          <Link to="/products" className={primaryButton + " mt-4"}><Pair en="Browse all" es="Ver todos"/></Link>
        </div>}
    </section>
  </main>
}
