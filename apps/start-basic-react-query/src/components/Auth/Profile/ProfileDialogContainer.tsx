import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { sectionData } from "./lib"
import Icon from "../../Icon"
import DialogContainer from "../DialogContainer"

type Props = ComponentProps<"div"> & {
  id: keyof typeof sectionData
}

function ProfileDialogContainer(
  { className, children, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const section = sectionData[props.id]

  return (
    <DialogContainer {...props} ref={ref}>
      <div className="relative w-12">
        <div className="sticky top-0 grid size-12 place-items-center">
          <Icon src={section.icon} alt="" className="size-5" />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </DialogContainer>
  )
}

export default forwardRef(ProfileDialogContainer)
