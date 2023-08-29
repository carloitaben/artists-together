import { User } from "lucia"

import { discordSSO, twitchSSO } from "~/actions/auth"
import { Container, Title } from "~/components/Modal"
import Connection from "./Connection"

type Props = {
  user: User
}

export default function SectionProfile({ user }: Props) {
  return (
    <Container>
      <Title>{user.username}</Title>
      <section>
        <div>Connections</div>
        <div className="space-y-2">
          <Connection user={user} provider="discord" action={discordSSO} />
          <Connection user={user} provider="twitch" action={twitchSSO} />
        </div>
      </section>
    </Container>
  )
}
