import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CatalogProvider } from './context/CatalogContext'
import { WishlistProvider } from './context/WishlistContext'
import { LanguageProvider } from './context/LanguageContext'
import './storefront.css'
import App from './App'
import 'tailwindcss/index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LanguageProvider><CatalogProvider>
      <WishlistProvider><App/></WishlistProvider>
    </CatalogProvider></LanguageProvider>
  </BrowserRouter>
)
