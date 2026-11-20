import React, { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext(null)
const storageKey = 'crochet-maker-language'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem(storageKey) === 'en' ? 'en' : 'es' }
    catch { return 'es' }
  })
  useEffect(() => {
    document.documentElement.lang = language
    try { localStorage.setItem(storageKey, language) } catch { /* Storage is optional. */ }
  }, [language])
  const t = (en, es) => language === 'es' && es ? es : en
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
export const useLanguage = () => useContext(LanguageContext)
