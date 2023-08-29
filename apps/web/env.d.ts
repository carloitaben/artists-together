/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./src/services/auth").Auth
  type DatabaseUserAttributes = import("./src/services/auth").UserAttributes
  type DatabaseSessionAttributes = {}
}

declare module "client-only"

declare module "server-only"
