import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { IconName } from "~/lib/types/icons"
import Anchor from "~/components/Anchor"
import Icon from "~/components/Icon"
import type { SectionId } from "../lib"

type Props = Omit<ComponentProps<typeof Anchor>, "href"> & {
  icon: IconName
  href: SectionId
}

function ProfileTab(
  { icon, href, children, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof Anchor>>,
) {
  return (
    <Anchor
      {...props}
      ref={ref}
      href={`#${href}`}
      className="radix-state-active:text-gunpla-white-500 flex items-center gap-x-2 rounded-full bg-gunpla-white-50 p-3 text-gunpla-white-300 shadow-button"
    >
      <Icon name={icon} alt="" className="size-6 flex-none" />
      {children}
    </Anchor>
  )
}

export default forwardRef(ProfileTab)
