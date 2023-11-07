/* eslint-disable @typescript-eslint/consistent-type-imports */

/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />
/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./app/server/auth.server").Auth
  type DatabaseUserAttributes =
    import("./app/server/auth.server").UserAttributes
  type DatabaseSessionAttributes = {}
}
