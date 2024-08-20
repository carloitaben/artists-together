import plugin from "tailwindcss/plugin"
import defaultTheme from "tailwindcss/defaultTheme"
import type { screens } from "~/../tailwind.config"

export type Screens = typeof screens

export type Screen = keyof Screens

/**
 * Enables the `Grid` component subgrid behavior
 */
export const subgridPlugin = plugin(({ addComponents, theme }) => {
  const columns = Object.assign(defaultTheme.gridColumn, theme("gridColumn"))

  addComponents(
    Object.fromEntries(
      Object.entries(columns).map(([key, value]) => {
        const columns = key.match(/\d+/)?.[0]

        return [
          `.col-${key}`,
          {
            "grid-column": value,
            "--subgrid-template-columns": columns
              ? `repeat(${columns}, minmax(0, 1fr))`
              : "",
          },
        ]
      }),
    ),
  )
})
