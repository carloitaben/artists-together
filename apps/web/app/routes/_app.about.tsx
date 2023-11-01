import WidgetTheme from "~/components/WidgetTheme"

export const handle = {
  actions: {
    paint: () => console.log("paint"),
  },
  page: {
    name: "About",
  },
}

export default function Page() {
  return (
    <main>
      <h1>hello there</h1>
      <WidgetTheme />
    </main>
  )
}