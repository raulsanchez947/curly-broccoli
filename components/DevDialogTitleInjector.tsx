"use client"
import { useEffect } from 'react'

export default function DevDialogTitleInjector(){
  useEffect(()=>{
    if(process.env.NODE_ENV === 'production') return

    const SELECTORS = ['[data-nextjs-dialog-content]','[data-radix-dialog-content]','[data-dialog-content]']
    function ensureTitle(el: Element){
      try{
        // if any heading exists, assume ok
        if(el.querySelector('h1,h2,h3,h4,h5,h6,[role="heading"]')) return
        // create a visually-hidden title
        const h = document.createElement('h2')
        h.className = 'sr-only'
        h.textContent = 'Dialog'
        // insert as first child
        el.insertBefore(h, el.firstChild)
      }catch(e){ /* ignore */ }
    }

    function scan(){
      SELECTORS.forEach(sel=>{
        document.querySelectorAll(sel).forEach(ensureTitle)
      })
    }

    const mo = new MutationObserver((mutations)=>{
      for(const m of mutations){
        if(m.type === 'childList'){
          m.addedNodes.forEach(n=>{
            if(!(n instanceof Element)) return
            SELECTORS.forEach(sel=>{
              if(n.matches && n.matches(sel)) ensureTitle(n)
              n.querySelectorAll && n.querySelectorAll(sel).forEach(ensureTitle)
            })
          })
        }
      }
    })

    scan()
    mo.observe(document.body, { childList: true, subtree: true })
    return ()=> mo.disconnect()
  },[])

  return null
}
