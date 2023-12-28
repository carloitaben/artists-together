import type { SerializeFrom } from "@vercel/remix"
import type { loader } from "~/routes/api.last-instagram-post"
import Image from "~/components/Image"
import Pill from "~/components/Pill"

const IG_HANDLE = "artiststogether.online"

type Props = {
  data: NonNullable<SerializeFrom<typeof loader>>
}

export default function WidgetInstagramContent({ data }: Props) {
  return (
    <a
      className="relative block h-full w-full"
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.instagram.com/artiststogether.online/"
    >
      <Image
        className="h-full w-full object-cover"
        src={data.asset}
        alt={data.alt}
      />
      <Pill className="absolute bottom-4 right-4">@{IG_HANDLE}</Pill>
    </a>
  )
}
