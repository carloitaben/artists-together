"use server"

import { cookies } from "next/headers"

import { Theme, cookie } from "./themes"

export async function demo(...args: any[]) {
  console.log("server action:", ...args)
}

export async function swapTheme(theme: Theme) {
  cookies().set(cookie, theme)
}
