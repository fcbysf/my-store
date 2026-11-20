import { emptyState, primaryButton, sectionHeading, shell } from './components/styles'
import React, { useEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useCatalog } from './context/CatalogContext'
import Header from './components/Header'
import Brand from './components/Brand'
import Pair from './components/Pair'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import MissingPage from './pages/MissingPage'

export default function App() {
  const { status, retry, bySlug } = useCatalog()
  const location = useLocation()
  const previousPath = useRef(null)

  useEffect(() => {
    if (status !== 'ready') return
    const parts = location.pathname.split('/').filter(Boolean)
    const product = parts[0] === 'products' ? bySlug.get(parts[1]) : null
    document.title = (product?.name || 'Crochet Pattern Shop') + ' · Crochet Maker'
    if (location.hash === '#patterns') document.getElementById('patterns')?.scrollIntoView()
    else if (previousPath.current !== location.pathname) window.scrollTo(0, 0)
    previousPath.current = location.pathname
  }, [location, status, bySlug])

  return <>
    <a className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-30 focus:bg-white focus:px-4 focus:py-2" href="#content"><Pair en="Skip to content" es="Saltar al contenido"/></a>
    <Header key={location.key}/>
    <div id="content" tabIndex={-1}>
      {status === 'loading' && <main className={shell + " " + emptyState} role="status"><Pair en="Loading patterns…" es="Cargando patrones…"/></main>}
      {status === 'error' && <main className={shell + " " + emptyState} role="alert">
        <h2 className={sectionHeading}><Pair en="The catalog couldn’t load" es="No se pudo cargar el catálogo"/></h2>
        <button className={primaryButton + " mt-4"} onClick={retry}><Pair en="Try again" es="Reintentar"/></button>
      </main>}
      {status === 'ready' && <Routes>
        <Route index element={<CatalogPage home/>}/>
        <Route path="/products" element={<CatalogPage/>}/>
        <Route path="/products/:slug" element={<ProductPage/>}/>
        <Route path="*" element={<MissingPage/>}/>
      </Routes>}
    </div>
    <footer className="bg-[#047857] text-white max-md:[body:has([data-purchase-dock])_&]:pb-[calc(4rem+env(safe-area-inset-bottom))]"><div className={shell + " flex flex-col items-start gap-4 py-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:py-9"}>
      <Brand footer/><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm [&_a:hover]:underline"><Link to="/products"><Pair en="Shop" es="Tienda"/></Link>
        <Link to="/products?saved=1"><Pair en="Saved" es="Guardados"/></Link></div>
      <span className="text-sm text-emerald-100">Digital PDF · English + Español</span>
    </div></footer>
  </>
}
