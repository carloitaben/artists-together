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
      <aside className="pointer-events-none absolute inset-x-0 top-0 hidden items-center justify-end py-4 sm:flex">
        <div className="pe-scrollbar">
          <ul className="flex items-center justify-center gap-1 rounded-4 bg-theme-50 p-0.5">
            {match.actions.map((action, index) => (
              <li key={action.label}>
                <CursorPrecision id={`topbar-action-${index}`}>
                  <a
                    {...action.link}
                    draggable={false}
                    className="pointer-events-auto grid size-[2.75rem] place-items-center gap-2 rounded-[0.875rem] bg-theme-200/0 text-theme-900 transition-colors duration-100 hover:bg-theme-200 active:bg-theme-300"
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
        </div>
      </aside>
    </Container>
  )
}
