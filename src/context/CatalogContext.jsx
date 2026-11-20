import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCollections, readCatalog } from '../lib/catalog'

const CatalogContext = createContext(null)
const endpoint = import.meta.env.VITE_CATALOG_URL || '/products.json'
const initialState = { status: 'loading', products: [] }

export function CatalogProvider({ children }) {
  const [state, setState] = useState(initialState)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt(value => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setState(initialState)
    async function load() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) throw new Error('Catalog request failed')
        const products = readCatalog(await response.json())
        if (!controller.signal.aborted) setState({ status: 'ready', products })
      } catch {
        if (!controller.signal.aborted) setState({ status: 'error', products: [] })
      }
    }
    load()
    return () => controller.abort()
  }, [attempt])

  const value = useMemo(() => ({
    ...state,
    retry,
    bySlug: new Map(state.products.map(product => [product.slug, product])),
    collections: getCollections(state.products),
    featured: state.products.find(product => product.featured) ?? state.products[0]
  }), [state, retry])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const catalog = useContext(CatalogContext)
  if (!catalog) throw new Error('useCatalog requires CatalogProvider')
  return catalog
}
