import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function PatternCaption({ product, showFormatBadge = true, showLanguages = true }) {
  const { t } = useLanguage()
  const name = t(product.shortName || product.name, product.es?.shortName || product.es?.name)
  const languages = product.languages?.map(label => ({ English: 'EN', Spanish: 'ES' })[label] || label)
  return <div className="pattern-caption">
    <h3>{name}</h3>
    {showFormatBadge && <div className="pattern-meta">
      <span className="format-badge">PDF{showLanguages && languages?.length > 0 && ' · ' + languages.join(' + ')}</span>
    </div>}
  </div>
}
