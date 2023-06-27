/// <reference types="lucia-auth" />

declare namespace Lucia {
  type Auth = import("./src/services/auth").Auth
  type UserAttributes = Omit<import("db").User, "id">
}  
