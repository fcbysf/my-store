import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { displayPrice, matchesProduct, productPath } from '../lib/catalog'
import { useLanguage } from '../context/LanguageContext'
import PatternImage from './PatternImage'
import Dialog from '../Dialog'
import { Icon } from '../icons'
import Brand from './Brand'
import Pair from './Pair'
import { iconButton, sectionHeading, shell } from './styles'

const dialogTitle = 'mb-4 flex items-center justify-between gap-2'
const resultLink = 'flex min-w-0 items-center gap-2 border-b border-[#bcebd5] px-1 py-2 hover:bg-[#e4f8ef] sm:gap-3'
const resultImage = 'size-10 shrink-0 rounded-lg object-cover sm:size-12'

function SearchPanel({ close }) {
  const { t, language } = useLanguage()
  const [query, setQuery] = useState('')
  const { products } = useCatalog()
  const navigate = useNavigate()
  const results = products.filter(p => matchesProduct(p, query))
  function search(event) {
    event.preventDefault()
    close()
    navigate('/products?q=' + encodeURIComponent(query.trim()) + '#patterns')
  }
  return <Dialog label={t('Search','Buscar')} onClose={close}>
    <div className={dialogTitle}><h2 className={sectionHeading + " text-wrap break-words"}><Pair en="Search" es="Buscar"/></h2>
      <button className={iconButton + " relative"} aria-label={t('Close','Cerrar')} onClick={close}><Icon name="close"/></button></div>
    <form className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#bcebd5] p-2" onSubmit={search}>
      <Icon name="search"/>
      <input className="min-h-11 min-w-0 flex-1 bg-transparent text-base" autoFocus type="search" aria-label={t('Pattern or collection','Patrón o colección')}
        placeholder={t('Pattern','Patrón')} value={query} onChange={e => setQuery(e.target.value)}/>
      <button className="min-h-11 w-full cursor-pointer rounded-xl bg-[#047857] px-3 text-sm font-semibold text-white hover:bg-[#056249] sm:w-auto"><Pair en="Search" es="Buscar"/></button>
    </form>
    <div className="mt-4">
      {results.map(p => <Link className={resultLink} key={p.slug} to={productPath(p)} onClick={close}>
        <PatternImage className={resultImage} product={p} sizes="48px" alt=""/><span className="min-w-0 wrap-break-word">{t(p.shortName || p.name, p.es?.shortName || p.es?.name)}</span><strong className="ml-auto shrink-0">{displayPrice(p,language)}</strong>
      </Link>)}
      {!results.length && <p><Pair en="No matching patterns" es="No hay resultados"/></p>}
    </div>
  </Dialog>
}

export default function Header() {
  const { t, language, setLanguage } = useLanguage()
  const [panel, setPanel] = useState(null)
  const close = () => setPanel(null)
  return <>
    <header className="border-b border-[#bcebd5] bg-white"><div className={shell + " grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 py-2 md:min-h-20 md:grid-cols-[1fr_auto_1fr] md:gap-x-6"}>
      <Brand/>
      <nav aria-label={t('Shop navigation','Tienda')} className="order-last col-span-2 flex flex-wrap items-center gap-x-4 text-sm font-semibold md:order-none md:col-span-1 md:gap-7 [&_a:hover]:underline [&_button:hover]:underline">
        <Link className="inline-flex min-h-11 items-center" to="/products"><Pair en="Shop" es="Tienda"/></Link>
      </nav>
      <div className="header-tools">
        <div className="languages" role="group" aria-label={t('Interface language','Idioma de la tienda')}>
          {[['es', 'es', 'Español'], ['en', 'us', 'English']].map(([code, country, label]) =>
            <button key={code} lang={code} aria-label={label} title={label} aria-pressed={language === code} onClick={() => setLanguage(code)}>
              <img src={'/images/flags/' + country + '.png'} width="28" height="18" alt=""/>
            </button>)}
        </div>
        <button className={iconButton + " relative"} aria-label={t('Search','Buscar')} onClick={() => setPanel('search')}><Icon name="search" size={22}/></button>
      </div>
    </div></header>
    {panel === 'search' && <SearchPanel close={close}/>}
  </>
}
