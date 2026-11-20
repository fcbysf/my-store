import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useWishlist } from '../context/WishlistContext'
import { collectionPath, displayPrice, matchesProduct, productPath } from '../lib/catalog'
import Dialog from '../Dialog'
import { Icon } from '../icons'
import Brand from './Brand'
import Pair from './Pair'
import { button, iconButton, sectionHeading, shell } from './styles'

const dialogTitle = 'mb-4 flex items-center justify-between gap-2'
const resultLink = 'flex min-w-0 items-center gap-2 border-b border-[#bcebd5] px-1 py-2 hover:bg-[#e4f8ef] sm:gap-3'
const resultImage = 'size-10 shrink-0 rounded-lg object-cover sm:size-12'

function SearchPanel({ close }) {
  const [query, setQuery] = useState('')
  const { products } = useCatalog()
  const navigate = useNavigate()
  const results = products.filter(p => matchesProduct(p, query))
  function search(event) {
    event.preventDefault()
    close()
    navigate('/products?q=' + encodeURIComponent(query.trim()) + '#patterns')
  }
  return <Dialog label="Search / Buscar" onClose={close}>
    <div className={dialogTitle}><h2 className={sectionHeading + " text-wrap break-words"}><Pair en="Search" es="Buscar"/></h2>
      <button className={iconButton + " relative"} aria-label="Close / Cerrar" onClick={close}><Icon name="close"/></button></div>
    <form className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#bcebd5] p-2" onSubmit={search}>
      <Icon name="search"/>
      <input className="min-h-10 min-w-0 flex-1 bg-transparent text-base" autoFocus type="search" aria-label="Pattern or collection / Patrón o colección"
        placeholder="Pattern / Patrón" value={query} onChange={e => setQuery(e.target.value)}/>
      <button className="min-h-10 w-full cursor-pointer rounded-xl bg-[#047857] px-3 text-sm font-semibold text-white hover:bg-[#056249] sm:w-auto"><Pair en="Search" es="Buscar"/></button>
    </form>
    <div className="mt-4">
      {results.map(p => <Link className={resultLink} key={p.slug} to={productPath(p)} onClick={close}>
        <img className={resultImage} src={p.image} alt=""/><span className="min-w-0 wrap-break-word">{p.name}<small className="block text-[#59736a]" lang="es">{p.es?.name}</small></span><strong className="ml-auto shrink-0">{displayPrice(p)}</strong>
      </Link>)}
      {!results.length && <p><Pair en="No matching patterns" es="No hay resultados"/></p>}
    </div>
  </Dialog>
}

export default function Header() {
  const [panel, setPanel] = useState(null)
  const { collections } = useCatalog()
  const { saved } = useWishlist()
  const close = () => setPanel(null)
  return <>
    <header className="border-b border-[#bcebd5] bg-white"><div className={shell + " grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 py-2 md:min-h-20 md:grid-cols-[1fr_auto_1fr] md:gap-x-6"}>
      <Brand/>
      <nav aria-label="Shop navigation / Tienda" className="order-last col-span-2 flex flex-wrap items-center gap-x-4 text-sm font-semibold md:order-none md:col-span-1 md:gap-7 [&_a:hover]:underline [&_button:hover]:underline">
        <Link className="inline-flex min-h-10 items-center" to="/products"><Pair en="Shop" es="Tienda"/></Link>
        <button className="flex min-h-11 cursor-pointer items-center gap-1.5" onClick={() => setPanel('collections')} aria-haspopup="dialog">
          <Pair en="Collections" es="Colecciones"/><Icon name="chevron" size={14}/>
        </button>
      </nav>
      <div className="flex justify-end">
        <button className={iconButton + " relative"} aria-label="Search / Buscar" onClick={() => setPanel('search')}><Icon name="search" size={22}/></button>
        <Link className={iconButton + " relative"} aria-label={'Saved / Guardados (' + saved.size + ')'} to="/products?saved=1">
          <Icon name="heart" size={22}/>{saved.size > 0 && <span className="absolute top-0 right-0 min-w-4 rounded-full bg-[#047857] px-1 text-center text-[.68rem] text-white">{saved.size}</span>}
        </Link>
      </div>
    </div></header>
    {panel === 'search' && <SearchPanel close={close}/>}
    {panel === 'collections' && <Dialog label="Collections / Colecciones" onClose={close}>
      <div className={dialogTitle}><h2 className={sectionHeading + " text-wrap break-words"}><Pair en="Collections" es="Colecciones"/></h2>
        <button className={iconButton + " relative"} aria-label="Close / Cerrar" onClick={close}><Icon name="close"/></button></div>
      <div className="my-4">{collections.map(c =>
        <Link className={resultLink} key={c.name} to={collectionPath(c.name)} onClick={close}>
          <img className={resultImage} src={c.image} alt=""/><Pair en={c.name} es={c.es}/><small className="ml-auto">{c.count}</small>
        </Link>)}</div>
      <Link className={button + " border border-[#bcebd5] hover:bg-[#e4f8ef]"} to="/products" onClick={close}><Pair en="All patterns" es="Todos los patrones"/></Link>
    </Dialog>}
  </>
}
