import { redirect } from "next/navigation"

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    redirect("/")
  }

  return <main>About</main>
}
