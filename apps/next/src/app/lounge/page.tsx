import type { Metadata } from "next"
import Profile from "~/components/Profile"

export const metadata: Metadata = {
  title: "Artists Lounge",
}

export default function Page() {
  return (
    <div>
      <div>loiunge</div>
      <Profile />
    </div>
  )
}
