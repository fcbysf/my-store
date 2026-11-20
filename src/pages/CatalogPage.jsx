import React from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import FeaturedPatterns from '../components/FeaturedPatterns'
import { useLanguage } from '../context/LanguageContext'
import { Icon } from '../icons'
import Pair from '../components/Pair'
import ProductCard from '../components/ProductCard'
import { emptyState, primaryButton, productGrid, sectionHeading, shell } from '../components/styles'

const collectionButton = 'inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-full border border-[#bcebd5] px-3 py-1.5 text-left text-sm font-medium hover:bg-[#e4f8ef] aria-pressed:border-[#047857] aria-pressed:bg-[#047857] aria-pressed:text-white'

export default function CatalogPage({ home = false }) {
  const { t } = useLanguage()
  const { featured, collections } = useCatalog()
  const { category, onlySaved, query, sort, results, change } = useCatalogFilters()
  const title = onlySaved ? ['Saved patterns', 'Patrones guardados'] : query ? ['Search results', 'Resultados'] : ['Pattern collection', 'Colección de patrones']
  return <main>
    {home && featured.length > 0 && !query && !onlySaved && <FeaturedPatterns products={featured}/>}
    <section className={shell + " scroll-mt-4 pt-8 pb-14 lg:pt-12 lg:pb-20"} id="patterns" aria-labelledby="catalog-title">
      <div className="catalog-toolbar">
        <div className="catalog-heading">
          <h2 id="catalog-title" className={sectionHeading}>{t(...title)}</h2>
          <span className="catalog-count" aria-live="polite">{results.length} <Pair en={results.length === 1 ? 'pattern' : 'patterns'} es={results.length === 1 ? 'patrón' : 'patrones'}/></span>
        </div>
        <label className="catalog-picker md:hidden">
          <select value={category} onChange={e => change('category', e.target.value)} aria-label={t('Filter by collection','Filtrar por colección')}>
            <option value="">{t('All collections','Colecciones: todas')}</option>
            {collections.map(c => <option key={c.name} value={c.name}>{t(c.name, c.es)}</option>)}
          </select>
          <Icon name="chevron" size={14}/>
        </label>
        <label className="catalog-picker catalog-sort">
          <span className="hidden md:inline"><Pair en="Sort" es="Ordenar"/></span>
          <select value={sort} onChange={e => change('sort', e.target.value)} aria-label={t('Sort patterns','Ordenar patrones')}>
            <option value="featured">{t('Featured', 'Destacados')}</option>
            <option value="low">{t('Lowest price','Menor precio')}</option>
            <option value="high">{t('Highest price','Mayor precio')}</option>
            <option value="name">{t('Name A–Z','Nombre A–Z')}</option>
          </select>
          <Icon name="chevron" size={14}/>
        </label>
        <div className="hidden flex-wrap gap-2 md:flex" role="group" aria-label={t('Filter by collection','Filtrar por colección')}>
          <button className={collectionButton} aria-pressed={!category} onClick={() => change('category','')}><Pair en="All" es="Todos"/></button>
          {collections.map(c => <button className={collectionButton} key={c.name} aria-pressed={category === c.name} onClick={() => change('category',c.name)}>
            <Pair en={c.name} es={c.es}/>
          </button>)}
        </div>
      </div>
      {query && <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full bg-[#e4f8ef] px-3 py-1 wrap-anywhere">“{query}” <button className="grid size-11 shrink-0 cursor-pointer place-items-center" aria-label={t('Clear search','Borrar búsqueda')} onClick={() => change('q','')}><Icon name="close" size={15}/></button></p>}
      {results.length > 0 ? <div className={productGrid}>{results.map(p => <ProductCard key={p.slug} product={p} showLanguages={!home}/>)}</div> :
        <div className={emptyState}><span className="flex justify-center"><Icon name={onlySaved ? 'heart' : 'search'} size={30}/></span>
          <h3 className={sectionHeading + " my-3"}><Pair en={onlySaved ? 'No saved matches' : 'No matching patterns'} es={onlySaved ? 'Sin patrones guardados para este filtro' : 'No hay resultados'}/></h3>
          {onlySaved && <p><Pair en="Tap a heart to save a pattern." es="Toca un corazón para guardar un patrón."/></p>}
          <Link to="/products" className={primaryButton + " mt-4"}><Pair en="Browse all" es="Ver todos"/></Link>
        </div>}
    </section>
  </main>
}
