import type { ReactNode } from "react"
import { useEffect, useState } from "react"

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientOnly({ children, fallback }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{children}</> : fallback
}
