"use client"

import { createSafeContext } from "~/lib/react/client"
import type { hints } from "./server"

export const [HintsContextProvider, useHints] =
  createSafeContext<ReturnType<typeof hints>>("HintsContext")
