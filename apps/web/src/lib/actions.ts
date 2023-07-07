"use server"

export async function demo(...args: any[]) {
  console.log("server action:", ...args)
}
