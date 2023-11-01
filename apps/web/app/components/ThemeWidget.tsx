import { Form } from "@remix-run/react"
import { $path } from "remix-routes"
import { theme, useTheme } from "~/lib/themes"

export default function ThemeWidget() {
  const currentTheme = useTheme()

  return (
    <div>
      <Form
        method="post"
        action={$path("/api/theme")}
        fetcherKey="theme"
        navigate={false}
        className="grid grid-cols-2"
      >
        <button name="theme" value={theme.enum["anamorphic-teal"]}>
          {currentTheme === theme.enum["anamorphic-teal"] ? ">" : ""}
          anamorphic-teal
        </button>
        <button name="theme" value={theme.enum["arpeggio-black"]}>
          {currentTheme === theme.enum["arpeggio-black"] ? ">" : ""}
          arpeggio-black
        </button>
        <button name="theme" value={theme.enum["outsider-violet"]}>
          {currentTheme === theme.enum["outsider-violet"] ? ">" : ""}
          outsider-violet
        </button>
        <button name="theme" value={theme.enum["tuxedo-crimson"]}>
          {currentTheme === theme.enum["tuxedo-crimson"] ? ">" : ""}
          tuxedo-crimson
        </button>
      </Form>
    </div>
  )
}
