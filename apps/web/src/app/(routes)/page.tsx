import Icon from "~/components/Icon"
import { logo } from "~/components/Icons"

function Social() {
  const discordHref = "https://discord.gg/9Ayh9dvhHe"
  const instagramHref = "https://www.instagram.com/artiststogether.online/"

  return (
    <>
      <h3 className="hidden sm:block">
        Follow us on{" "}
        <a
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
          href={instagramHref}
        >
          Instagram
        </a>
        <br />
        or join our{" "}
        <a
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
          href={discordHref}
        >
          Discord
        </a>{" "}
        server.
      </h3>
      <ul className="js:invisible whitespace-nowrap text-center sm:hidden sm:pb-3">
        <li className="mx-2.5 inline-block">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block underline"
            href={instagramHref}
          >
            Instagram
          </a>
        </li>
        <li className="mx-2.5 inline-block">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block underline"
            href={discordHref}
          >
            Discord
          </a>
        </li>
      </ul>
    </>
  )
}

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <header className="mt-16">
        <h1 className="sr-only">Artists Together</h1>
        <Icon label="" className="w-full max-w-[16.25rem] sm:max-w-[26.5rem]">
          {logo}
        </Icon>
      </header>
      <main className="flex flex-1 flex-col justify-end gap-16 overflow-hidden pb-3 pr-5 font-serif leading-none sm:pb-16 sm:text-8xl">
        <div className="flex flex-1 items-center justify-center sm:block sm:flex-none sm:text-right">
          <h2>
            An inclusive community
            <br />
            for all kinds of artists.
          </h2>
        </div>
        <Social />
      </main>
    </div>
  )
}
