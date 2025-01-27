import { usePathname } from "next/navigation"
import { useMemo } from "react"
import type { Props } from "~/components/NavLink"
import { matches, navigation } from "./shared"

export function useMatches(props: Pick<Props, "href" | "match">) {
  const pathname = usePathname()
  return matches(pathname, props)
}

export function useNavigationMatch() {
  const pathname = usePathname()
  return useMemo(
    () =>
      navigation.find((item) =>
        matches(pathname, {
          href: item.link.href,
          match: "match" in item.link ? item.link.match : undefined,
        }),
      ),
    [pathname],
  )
}
