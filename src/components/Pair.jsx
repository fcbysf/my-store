import React from 'react'

export default function Pair({ en, es }) {
  return <span>
    {en}
    {es && es !== en && <><span className="opacity-55"> / </span><span lang="es">{es}</span></>}
  </span>
}
