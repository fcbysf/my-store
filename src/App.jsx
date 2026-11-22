import { emptyState, primaryButton, sectionHeading, shell } from './components/styles'
import React, { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { useCatalog } from './context/CatalogContext'
import Header from './components/Header'
import Footer from './components/Footer'
import { useLanguage } from './context/LanguageContext'
import Pair from './components/Pair'
import CatalogPage from './pages/CatalogPage'
import MissingPage from './pages/MissingPage'

function LegacyProductLink() {
  const { slug } = useParams()
  const { bySlug } = useCatalog()
  const destination = bySlug.get(slug)?.productUrl
  useEffect(() => {
    if (destination) window.location.replace(destination)
  }, [destination])
  return destination ? <a href={destination}><Pair en="Open pattern" es="Abrir patrón"/></a> : <Navigate to="/products" replace/>
}

export default function App() {
  const { status, retry } = useCatalog()
  const { language } = useLanguage()
  const location = useLocation()
  const previousPath = useRef(null)

  useEffect(() => {
    if (status !== 'ready') return
    if (location.hash === '#patterns') document.getElementById('patterns')?.scrollIntoView()
    else if (previousPath.current !== location.pathname) window.scrollTo(0, 0)
    previousPath.current = location.pathname
  }, [location, status])

  useEffect(() => {
    const shop = location.pathname.startsWith('/products')
    const title = shop ? (language === 'es' ? 'Tienda' : 'Shop') : (language === 'es' ? 'Inicio' : 'Home')
    document.title = title + ' · Crochet Maker'
  }, [location.pathname, language])

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
        <Route path="/products/:slug" element={<LegacyProductLink/>}/>
        <Route path="*" element={<MissingPage/>}/>
      </Routes>}
    </div>
    <Footer/>
  </>
}
