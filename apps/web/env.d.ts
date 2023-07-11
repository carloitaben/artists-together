/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./src/services/auth").Auth
  type DatabaseUserAttributes = Omit<import("db").User, "id">
  type DatabaseSessionAttributes = {}
}
