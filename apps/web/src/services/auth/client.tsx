"use client"

import type { SessionValidationResult } from "@artists-together/core/auth"
import { createSafeContext } from "~/lib/react/client"

export const [AuthProvider, useAuth] =
  createSafeContext<SessionValidationResult>("UserProvider", null)
