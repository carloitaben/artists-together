import { Suspense } from "react"

import { wait } from "~/lib/utils"

import Pill from "~/components/Pill"

const IG_HANDLE = "artiststogether.online"

async function Content() {
  await wait(2000)

  return (
    <a
      className="relative block h-full w-full"
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.instagram.com/artiststogether.online/"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
        alt=""
        draggable={false}
      />
      <Pill className="absolute bottom-4 right-4">@{IG_HANDLE}</Pill>
    </a>
  )
}

function Fallback() {
  return <div className="h-full w-full bg-theme-700" />
}

export default function WidgetInstagram() {
  return (
    <div className="col-span-4 select-none sm:col-span-3">
      <div className="relative overflow-hidden rounded-3xl pb-[100%] shadow-card">
        <div className="absolute inset-0">
          <Suspense fallback={<Fallback />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
