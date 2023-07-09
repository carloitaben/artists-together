import { redirect } from "next/navigation"

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    redirect("/")
  }

  return <main>Lounge</main>
}
