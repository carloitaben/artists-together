import { User } from "lucia"

import { Container, Title } from "~/components/Modal"
import ConnectWithTwitch from "./TEST_ConnectWithTwitch"

type Props = {
  user: User
}

export default function SectionProfile({ user }: Props) {
  return (
    <Container>
      <Title>{user.username}</Title>
      <section>
        <div>Connections</div>
        <div>
          Discord connection:{" "}
          {user.discord_metadata ? "connected" : "Disconnected"}
        </div>
        <div>
          Twitch connection:{" "}
          {user.twitch_metadata ? "connected" : "Disconnected"}
          <ConnectWithTwitch />
        </div>
      </section>
    </Container>
  )
}
