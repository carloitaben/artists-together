"use client"

import { useNavigationMatch } from "~/lib/navigation/client"
import Container from "../Container"
import { CursorPrecision } from "../Cursors"
import Icon from "../Icon"

export default function NavigationTopbar() {
  const match = useNavigationMatch()

  if (!match) {
    return null
  }

  return (
    <Container asChild>
      <aside className="pointer-events-none absolute inset-x-0 top-0 hidden py-4 sm:block">
        <ul className="flex items-center justify-end gap-2 pe-scrollbar">
          {match.actions.map((action, index) => (
            <li key={action.label}>
              <CursorPrecision id={`topbar-action-${index}`}>
                <a
                  {...action.link}
                  className="pressable pointer-events-auto grid size-12 place-items-center gap-2 rounded-full bg-gunpla-white-50 text-arpeggio-black-900"
                >
                  <Icon
                    src={action.icon}
                    alt={action.label}
                    className="size-6"
                  />
                </a>
              </CursorPrecision>
            </li>
          ))}
        </ul>
      </aside>
    </Container>
  )
}
