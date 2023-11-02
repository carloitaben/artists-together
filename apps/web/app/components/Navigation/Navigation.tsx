import { useSearchParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import Auth from "~/components/Auth"
import * as Modal from "~/components/Modal"
import NavigationBottomAppBar from "./NavigationBottomAppBar"
import NavigationRailAppBar from "./NavigationRailAppBar"

export default function Navigation() {
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (params.get("modal") !== "auth") return
    setOpen(true)
    setParams(
      (params) => {
        params.delete("modal")
        return params
      },
      { replace: true },
    )
  }, [params, setParams])

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <NavigationBottomAppBar />
      <NavigationRailAppBar />
      <Auth />
    </Modal.Root>
  )
}
