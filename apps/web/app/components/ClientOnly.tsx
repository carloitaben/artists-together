import type { ReactNode } from "react"
import { useEffect, useState } from "react"

type Props = {
  show?: boolean
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientOnly({ children, show = true, fallback }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true && show)
  }, [show])

  return mounted ? <>{children}</> : fallback
}
