"use server"

import { Theme } from "./themes"

export async function demo(...args: any[]) {
  console.log("server action:", ...args)
}

export async function swapTheme(theme: Theme) {
  console.log("swap theme cookie and reload router", { theme })
}