import Anchor from "~/components/Anchor"
import Icon from "~/components/Icon"
import type { Section } from "./lib"
import { sectionData } from "./lib"

export default function ProfileTab({ section }: { section: Section }) {
  const data = sectionData[section]

  return (
    <Anchor
      href={`#${section}`}
      className="flex h-12 items-center gap-x-2 rounded-full bg-gunpla-white-50 px-3 text-gunpla-white-500 transition-transform active:scale-95 disabled:active:scale-100"
    >
      <Icon src={data.icon} alt="" className="size-6 flex-none" />
      <span>{data.label}</span>
    </Anchor>
  )
}
