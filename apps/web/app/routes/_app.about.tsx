import ThemeWidget from "~/components/ThemeWidget"

export const handle = {
  actions: {
    paint: () => console.log("paint"),
  },
}

export default function Page() {
  return (
    <main>
      <h1>hello there</h1>
      <ThemeWidget />
    </main>
  )
}
