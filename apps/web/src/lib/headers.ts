import "server-only"
import { cache } from "react"
import { headers } from "next/headers"

export const saveData = cache(() => headers().get("Save-Data") === "on")
