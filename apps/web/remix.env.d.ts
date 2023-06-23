/* eslint-disable @typescript-eslint/consistent-type-imports */

/// <reference types="@remix-run/dev" />
/// <reference types="@vercel/remix" />
/// <reference types="lucia-auth" />

declare namespace Lucia {
  type Auth = import("./app/services/auth.server").Auth
  type UserAttributes = Omit<import("db").User, "id">
}
