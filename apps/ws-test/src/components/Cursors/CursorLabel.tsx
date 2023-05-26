import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function CursorLabel({ children }: Props) {
  return (
    <div className="bg-white rounded-full inline-flex h-6 px-2 items-center justify-center text-center">{children}</div>
  )
}
