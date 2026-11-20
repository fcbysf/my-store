import React from 'react'

export function Icon({ name, size = 20, ...props }) {
  const paths = {
    search: <><circle cx="10.5" cy="10.5" r="6.8"/><path d="m16 16 5 5"/></>,
    heart: <path d="M20.2 4.9a5 5 0 0 0-7.1 0L12 6l-1.1-1.1a5 5 0 0 0-7.1 7.1L12 20.2l8.2-8.2a5 5 0 0 0 0-7.1Z"/>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    zoom: <><circle cx="10.5" cy="10.5" r="6.8"/><path d="m16 16 5 5M7.8 10.5h5.4m-2.7-2.7v5.4"/></>,
    file: <><path d="M5 2.5h9l5 5V21H5z"/><path d="M14 2.5V8h5M8.5 12h7m-7 4h5"/></>,
    language: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/></>,
    level: <><path d="M4 20v-4h3v4zM10.5 20v-9h3v9zM17 20V4h3v16z"/></>,
    bag: <><path d="M4 8h16l1 13H3z"/><path d="M8 9V7a4 4 0 1 1 8 0v2"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    spark: <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/>
  }
  return <svg className="shrink-0" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>
}

export function YarnMark() {
  return <svg className="size-8 shrink-0 md:size-[43px]" width="43" height="43" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="20.5" cy="25" r="14.3"/>
    <path d="M9.4 16.1c10 1.1 19.6 7.3 24.6 14.1M13.3 12.9c9.4 1.5 17.1 6.8 21.4 12.1M7 21c3.3.4 6.6-.8 9.8-2.9M6.4 25.6c5.6-.2 10.2-2.1 14.6-5.1M7.5 30.6c7.5-.9 13.6-3.5 18-7.5M10.5 35c7.9-1.6 14.2-4.9 18.8-9.2M15.5 38.3c7.7-2.3 12.7-5.5 16.3-9.6M25 11.2l8.7-7.9 2.1 1.9-7.6 8M32 34.2c2.5 3.4 3 8.5 7.2 8.5 2.4 0 4.3-1.3 4.7-3"/>
  </svg>
}
