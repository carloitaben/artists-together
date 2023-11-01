/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />
/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./app/services/auth.server").Auth
  type DatabaseUserAttributes = import("./app/services/auth.server").UserAttributes
  type DatabaseSessionAttributes = {}
}
