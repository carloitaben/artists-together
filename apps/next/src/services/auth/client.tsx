"use client"

import type { User } from "@artists-together/auth"
import { createSafeContext } from "~/lib/react/client"

export const [AuthProvider, useUser] = createSafeContext<User | null>(
  "UserProvider",
  null,
)
