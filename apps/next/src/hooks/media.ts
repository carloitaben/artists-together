"use client"
import { useState, useTransition } from "react"

const precached = new Set<string>()

function precacheImpl(url: string) {
  return new Promise<string>((resolve, reject) => {
    if (precached.has(url)) {
      return resolve(url)
    }

    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = reject
    img.src = url
  })
}

export function precache(urls: string[]) {
  return Promise.allSettled(urls.map(precacheImpl))
}

export function usePrecache(urls: string[]) {
  const [pending, startTransition] = useTransition()
  const [cached, setCached] = useState(() =>
    urls.every((url) => precached.has(url)),
  )

  function startCaching() {
    if (cached || pending) return

    startTransition(async () => {
      await precache(urls)
      setCached(true)
    })
  }

  return [cached, startCaching] as const
}
