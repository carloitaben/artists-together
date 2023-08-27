import { logo } from "~/components/Icons"
import Icon from "~/components/Icon"
import Animations from "./components/Animations"

function Social() {
  const discordHref = "https://discord.gg/9Ayh9dvhHe"
  const instagramHref = "https://www.instagram.com/artiststogether.online/"

  return (
    <>
      <h3 data-animated-text className="hidden js:invisible sm:block">
        Follow us on{" "}
        <a
          className="underline transition-[font-weight] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:font-medium"
          target="_blank"
          rel="noopener noreferrer"
          href={instagramHref}
        >
          Instagram
        </a>
        <br />
        or join our{" "}
        <a
          className="underline transition-[font-weight] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:font-medium"
          target="_blank"
          rel="noopener noreferrer"
          href={discordHref}
        >
          Discord
        </a>{" "}
        server.
      </h3>
      <ul
        data-animated-text
        className="whitespace-nowrap text-center js:invisible sm:hidden sm:pb-3"
      >
        <li className="mx-2.5 inline-block">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-[font-weight] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:font-medium"
            href={instagramHref}
          >
            Instagram
          </a>
        </li>
        <li className="mx-2.5 inline-block">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-[font-weight] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:font-medium"
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
      <header className="-mb-7 self-center px-12 pt-20 sm:mb-0 sm:mt-[3.75rem] sm:self-auto sm:p-0">
        <h1 className="sr-only">Artists Together</h1>
        <Icon
          label=""
          data-element="logo"
          className="3xl:max-w-[27.5rem] w-full max-w-[16.25rem] js:opacity-0 sm:max-w-[22vw]"
        >
          {logo}
        </Icon>
      </header>
      <main className="3xl:text-[6.25rem]/[6.25rem] flex flex-1 flex-col justify-end gap-16 overflow-hidden px-3 pb-3 font-serif text-[8.333vw] font-light leading-none xs:text-3xl sm:gap-[4.167vw] sm:pb-[3.25rem] sm:pr-5 sm:text-[5vw]/[5vw]">
        <div className="flex flex-1 items-center justify-center text-center sm:block sm:flex-none sm:text-right">
          <h2 data-animated-text className="js:invisible">
            An inclusive community
            <br />
            for all kinds of artists.
          </h2>
        </div>
        <Social />
      </main>
      <Animations />
    </div>
  )
}
