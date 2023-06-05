/// <reference types="lucia-auth" />

import { InferModel, user } from "db"
import { Auth } from "~/lib/auth"

type User = InferModel<typeof user, "select">

declare namespace Lucia {
  type Auth = Auth
  type UserAttributes = Omit<User, "id">
}
