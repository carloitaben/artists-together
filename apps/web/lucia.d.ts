/// <reference types="lucia-auth" />

declare namespace Lucia {
  type Auth = import("./src/lib/auth").Auth
  type UserAttributes = Omit<import("db").User, "id">
}  
