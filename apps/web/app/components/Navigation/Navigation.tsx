import { useSearchParams } from "@remix-run/react"
import { useEffect } from "react"
import Auth from "~/components/Auth"
import * as Modal from "~/components/Modal"
import NavigationBottomAppBar from "./NavigationBottomAppBar"
import NavigationRailAppBar from "./NavigationRailAppBar"

export default function Navigation() {
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    if (params.get("modal") !== "auth") return

    setParams(
      (params) => {
        params.delete("modal")
        return params
      },
      { replace: true },
    )
  }, [params, setParams])

  const defaultOpen = params.get("modal") === "auth"

  return (
    <Modal.Root defaultOpen={defaultOpen}>
      <NavigationBottomAppBar />
      <NavigationRailAppBar />
      <Auth />
    </Modal.Root>
  )
}
