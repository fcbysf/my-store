import React from 'react'
import { Link } from 'react-router-dom'
import { YarnMark } from '../icons'
import { useLanguage } from '../context/LanguageContext'

export default function Brand() {
  const { t } = useLanguage()
  return <Link className="brand" to="/" aria-label={t('Crochet Maker home', 'Inicio de Crochet Maker')}><YarnMark/>Crochet Maker</Link>
}
