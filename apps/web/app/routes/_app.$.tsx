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
}

export default function Page() {
  return (
    <Container asChild grid>
      <main className="min-h-full items-center py-16">
        <figure className="col-span-4 sm:col-span-2 sm:col-start-4 space-y-4 pb-2 sm:pb-0">
          <img
            src=""
            alt=""
            className="bg-theme-300 w-full"
            decoding="async"
            loading="lazy"
            draggable={false}
            width={448}
            height={448}
          />
          <figcaption className="flex items-center gap-4">
            <Avatar user={user} className="w-8 h-8" />@{user.username}
          </figcaption>
        </figure>
      </main>
    </Container>
  )
}
