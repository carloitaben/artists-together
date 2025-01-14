import { CursorPrecision } from "~/components/Cursors"
import Container from "~/components/Container"
import Grid from "~/components/Grid"
import { createPrecisionScope } from "./Cursors/lib"

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
    <CursorPrecision name="footer" asChild>
      <Container className="pb-16 pt-4 sm:pb-4">
        <Grid asChild>
          <footer className="rounded-6 bg-arpeggio-black-800 py-12">
            <div className="col-span-4 space-y-14 px-5 sm:col-span-2 sm:col-start-7 sm:px-0">
              <Grid asChild>
                <nav aria-label="Secondary navigation">
                  <ul className="space-y-2">
                    {links.map((link, index) => (
                      <li key={link.label}>
                        <CursorPrecision
                          name={createPrecisionScope("link", String(index))}
                          asChild
                        >
                          <a
                            href={link.href}
                            target={"target" in link ? link.target : undefined}
                            className="hover:underline"
                          >
                            {link.label}
                          </a>
                        </CursorPrecision>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Grid>
              <CursorPrecision name="small" asChild>
                <small className="block text-sm">
                  Artists&nbsp;Together ©&nbsp;{new Date().getFullYear()}
                </small>
              </CursorPrecision>
            </div>
          </footer>
        </Grid>
      </Container>
    </CursorPrecision>
  )
}
