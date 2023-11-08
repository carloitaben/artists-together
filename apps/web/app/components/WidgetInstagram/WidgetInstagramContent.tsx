import Image from "~/components/Image"
import Pill from "~/components/Pill"

const IG_HANDLE = "artiststogether.online"

export default function WidgetInstagramContent() {
  return (
    <a
      className="relative block h-full w-full"
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.instagram.com/artiststogether.online/"
    >
      <Image
        className="h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
        alt=""
      />
      <Pill className="absolute bottom-4 right-4">@{IG_HANDLE}</Pill>
    </a>
  )
}
