import React, { useEffect, useRef } from 'react'

export default function Dialog({ label, onClose, children, className = 'w-[calc(100%-2rem)] max-w-[520px] border border-[#dfd6ca]', innerClassName = 'p-4 sm:p-6', onKeyDown }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = previous }
  }, [])
  return <dialog ref={ref} aria-label={label} className={'m-auto max-h-[85vh] max-h-[85dvh] overflow-auto rounded-2xl bg-white text-[#3d2c1e] shadow-xl backdrop:bg-[#30241980] ' + className} onKeyDown={onKeyDown}
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === ref.current) onClose() }}>
    <div className={innerClassName}>{children}</div>
  </dialog>
}
