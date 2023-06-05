/// <reference types="lucia-auth" />

import { InferModel, user } from "db"

type User = InferModel<typeof user, "select">

declare namespace Lucia {
  type Auth = import("./src/lib/auth").Auth
  type UserAttributes = Omit<User, "id">
}  
