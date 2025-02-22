"use server"

import { cache } from "react"
import { getHints as getHintsImplementation } from "./server"

export const getHints = cache(getHintsImplementation)
