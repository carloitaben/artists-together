import type { MetaFunction } from "@vercel/remix"
import Container from "~/components/Container"

export const meta: MetaFunction = () => [
  {
    title: "Calendar – Artists Together",
  },
]

export const handle = {
  actions: {
    prev: () => {
      console.log("previous year")
    },
    next: () => {
      console.log("next year")
    },
  },
  page: {
    name: "Calendar",
  },
}

export default function Page() {
  return (
    <Container className="h-full">
      <div className="h-12 bg-theme-800 w-full relative">
        <div className="sticky left-16 inline-block">hola si</div>
      </div>
      <main className="flex w-full">
        <div className="h-[1600px] flex-none w-[600px] bg-theme-800">hi</div>
        <div className="h-[1600px] flex-none w-[600px] bg-theme-800">hi</div>
        <div className="h-[1600px] flex-none w-[600px] bg-theme-800">hi</div>
        <div className="h-[1600px] flex-none w-[600px] bg-theme-800">hi</div>
        <div className="h-[1600px] flex-none w-[600px] bg-theme-800">hi</div>
        <div className="h-[1600px] flex-none w-[600px] bg-theme-800">hi</div>
      </main>
    </Container>
  )
}
