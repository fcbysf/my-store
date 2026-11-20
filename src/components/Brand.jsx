import React from 'react'
import { Link } from 'react-router-dom'
import { YarnMark } from '../icons'

export default function Brand({ footer = false }) {
  return <Link className={`inline-flex min-w-0 items-center gap-2 ${footer ? 'text-white' : 'text-[#047857]'}`} to="/" aria-label="Crochet Maker home / Inicio">
    <YarnMark/><span className="text-[clamp(1.1rem,5vw,1.78rem)] leading-none font-bold tracking-[-.075em] md:text-[2.05rem] [font-family:Inter,'Segoe_UI',Arial,sans-serif]">Crochet Maker</span>
  </Link>
}
