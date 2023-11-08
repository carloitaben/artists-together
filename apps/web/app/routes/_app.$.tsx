import { useLoaderData } from "@remix-run/react"
import { getRemoteLQIP } from "~/server/files.server"
import Image from "~/components/Image"
import Avatar from "~/components/Avatar"
import Container from "~/components/Container"

export const handle = {
  actions: {},
  page: {
    name: "404",
  },
}

const user = {
  username: "evilAFM",
  theme: "anamorphic-teal",
  avatar: null,
} as const

export async function loader() {
  const src = "https://i1.sndcdn.com/artworks-000070701368-di7zt7-t500x500.jpg"
  const lqip = await getRemoteLQIP(src)

  return {
    src,
    lqip,
  }
}

export default function Page() {
  const data = useLoaderData<typeof loader>()

  return (
    <Container asChild grid>
      <main className="min-h-full items-center py-16">
        <figure className="col-span-4 sm:col-span-2 sm:col-start-4 space-y-4 pb-2 sm:pb-0">
          <Image
            src={data.src}
            lqip={data.lqip}
            alt=""
            className="bg-theme-300 w-full"
            width={500}
            height={500}
          />
          <figcaption className="flex items-center gap-4">
            <Avatar user={user} className="w-8 h-8" />@{user.username}
          </figcaption>
        </figure>
      </main>
    </Container>
  )
}
