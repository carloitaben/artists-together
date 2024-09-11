"use client"

import type { User } from "@artists-together/core/auth"
import { createSafeContext } from "~/lib/react/client"

export const [AuthProvider, useUser] = createSafeContext<User | null>(
  "UserProvider",
  null,
)
