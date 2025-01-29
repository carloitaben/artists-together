import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import Icon from "~/components/Icon"
import DialogContainer from "../DialogContainer"
import { sectionData } from "./lib"

type Props = ComponentProps<"div"> & {
  id: keyof typeof sectionData
}

function ProfileDialogContainer(
  { className, children, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const section = sectionData[props.id]

  return (
    <DialogContainer
      {...props}
      ref={ref}
      className="flex pr-8 md:block md:px-12"
    >
      <div className="relative w-12">
        <div className="sticky top-0 grid size-12 place-items-center md:hidden">
          <Icon src={section.icon} alt="" className="size-5" />
        </div>
      </div>
      <div className="flex-1 pb-8 pt-3.5 md:pb-12 md:pt-10">{children}</div>
    </DialogContainer>
  )
}

export default forwardRef(ProfileDialogContainer)
