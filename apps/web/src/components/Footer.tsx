import { cx } from "cva"
import Container, { gap } from "./Container"

const links = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/artiststogether.online",
    target: "_blank",
  },
  {
    label: "Twitch",
    href: "https://www.twitch.tv/artiststogether",
    target: "_blank",
  },
  {
    label: "Discord",
    href: "https://discord.gg/9Ayh9dvhHe",
    target: "_blank",
  },
  {
    label: "Redbubble",
    href: "https://www.redbubble.com/people/ArtTog",
    target: "_blank",
  },
  {
    label: "Contact us",
    href: "mailto:info@artiststogether.online",
    target: "_blank",
  },
]

export default function Footer() {
  return (
    <Container className="pb-16 pt-4 sm:pb-4">
      <Container asChild grid>
        <footer className="rounded-3xl bg-arpeggio-black-800 py-12">
          <div className="col-span-4 space-y-14 sm:col-span-2 sm:col-start-7">
            <nav
              aria-label="Secondary navigation"
              className={cx("grid-cols-2 sm:grid", gap.x)}
            >
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={"target" in link ? link.target : undefined}
                      className="hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <small className="block text-sm">
              Artists&nbsp;Together ©&nbsp;{new Date().getFullYear()}
            </small>
          </div>
        </footer>
      </Container>
    </Container>
  )
}
