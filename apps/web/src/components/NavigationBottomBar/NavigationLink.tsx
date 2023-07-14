import NextLink from "next/link"
import { ComponentProps } from "react"
import { usePathname } from "next/navigation"
import { cx } from "class-variance-authority"

type Props = ComponentProps<typeof NextLink>

export default function NavigationLink({
  href,
  className,
  children,
  ...props
}: Props) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <NextLink
      {...props}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(className, "group block focus:outline-none")}
    >
      {children}
    </NextLink>
  )
}
