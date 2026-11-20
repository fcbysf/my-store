import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CatalogProvider } from './context/CatalogContext'
import { WishlistProvider } from './context/WishlistContext'
import App from './App'
import 'tailwindcss/index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CatalogProvider>
      <WishlistProvider><App/></WishlistProvider>
    </CatalogProvider>
  </BrowserRouter>
)
