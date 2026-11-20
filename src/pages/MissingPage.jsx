import React from 'react'
import { Link } from 'react-router-dom'
import Pair from '../components/Pair'
import { emptyState, primaryButton, sectionHeading, shell } from '../components/styles'

export default function MissingPage() {
  return <main className={shell + " " + emptyState}>
    <h1 className={sectionHeading}><Pair en="Pattern not found" es="Patrón no encontrado"/></h1>
    <Link className={primaryButton + " mt-4"} to="/products"><Pair en="Browse patterns" es="Ver patrones"/></Link>
  </main>
}
