import type { IronSessionOptions } from "iron-session"

type User = {
  isLoggedIn: boolean
  login: string
  avatarUrl: string
}

export const sessionOptions: IronSessionOptions = {
  password: (process.env.SECRET_COOKIE_PASSWORD as string) || "2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8",
  cookieName: "_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User
  }
}
