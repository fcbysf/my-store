import React, { createContext, useContext, useMemo, useSyncExternalStore } from 'react'

const WishlistContext = createContext(null)
const key = 'paper-crafts-saved'
const listeners = new Set()
let memory = '[]'
let memoryOnly = false

function snapshot() {
  if (memoryOnly) return memory
  try { memory = localStorage.getItem(key) ?? '[]' } catch { /* Use the in-memory list. */ }
  return memory
}

function decode(raw) {
  try {
    const list = JSON.parse(raw)
    if (Array.isArray(list)) return new Set(list.filter(item => typeof item === 'string'))
  } catch { /* Ignore invalid data from a previous browser session. */ }
  return new Set()
}

function subscribe(listener) {
  function sync(event) {
    if (event.key === key || event.key === null) listener()
  }
  listeners.add(listener)
  window.addEventListener('storage', sync)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', sync)
  }
}

function toggle(slug) {
  const list = decode(snapshot())
  if (list.has(slug)) list.delete(slug)
  else list.add(slug)
  memory = JSON.stringify([...list])
  try { localStorage.setItem(key, memory) } catch { memoryOnly = true }
  listeners.forEach(notify => notify())
}

export function WishlistProvider({ children }) {
  const raw = useSyncExternalStore(subscribe, snapshot)
  const value = useMemo(() => ({ saved: decode(raw), toggle }), [raw])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const wishlist = useContext(WishlistContext)
  if (!wishlist) throw new Error('useWishlist requires WishlistProvider')
  return wishlist
}
