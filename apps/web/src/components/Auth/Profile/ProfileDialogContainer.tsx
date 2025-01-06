import type { ComponentProps } from "react"
import { sectionData } from "./lib"
import Icon from "../../Icon"
import DialogContainer from "../DialogContainer"

type Props = ComponentProps<"div"> & {
  id: keyof typeof sectionData
}

export default function ProfileDialogContainer({
  className,
  children,
  ...props
}: Props) {
  const section = sectionData[props.id]

  return (
    <DialogContainer
      {...props}
      padding="y"
      className="flex pr-8 md:block md:px-12"
    >
      <div className="relative w-12">
        <div className="sticky top-0 grid size-12 place-items-center md:hidden">
          <Icon src={section.icon} alt="" className="size-5" />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </DialogContainer>
  )
}
