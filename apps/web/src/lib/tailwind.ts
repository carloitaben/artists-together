import defaultTheme from "tailwindcss/defaultTheme"
import plugin from "tailwindcss/plugin"
import type { PluginAPI } from "tailwindcss/types/config"
import * as v from "valibot"
import type { screens } from "../../tailwind.config"
import { colors } from "../../tailwind.config"

export type Screens = typeof screens

export type Screen = keyof Screens

function parseScaleValue(value: string) {
  if (value.endsWith("rem")) {
    return {
      success: true,
      unit: "rem",
      value: parseFloat(value.replace("rem", "")),
    } as const
  }

  if (value.endsWith("px")) {
    return {
      success: true,
      unit: "px",
      value: parseFloat(value.replace("px", "")),
    } as const
  }

  return {
    success: false,
    error: `Cannot scale value "${value}"`,
  } as const
}

/**
 * Enables the `scale:` variant for declaring properties that resize
 * with the browser width.
 */
export const pluginScale = plugin(({ addVariant }) => {
  // @ts-expect-error This definitely exists but it's missing in Tailwind types
  addVariant("scale", ({ container }) => {
    // @ts-expect-error This definitely exists but it's missing in Tailwind types
    container.walkRules((rule) => {
      rule.selector = `.scale\\:${rule.selector.slice(1)}`
      // @ts-expect-error This definitely exists but it's missing in Tailwind types
      rule.walkDecls((declaration) => {
        const parsed = parseScaleValue(declaration.value)

        if (!parsed.success) {
          throw Error(
            `Error while parsing class with 'scale' variant "${rule.selector}": ${parsed.error}`,
          )
        }

        switch (parsed.unit) {
          case "rem":
            declaration.value = `calc(var(--root-font-size) * ${parsed.value * 100}vw / var(--root-viewport-width))`
            break
          case "px":
            declaration.value = `calc(${parsed.value * 100}vw / var(--root-viewport-width))`
            break
        }
      })
    })
  })
})

/**
 * Overrides the default `grid-template-columns: subgrid` and enables
 * nesting grids on older browsers.
 */
export const pluginSubgrid = plugin(({ addComponents, theme }) => {
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

export const themeableColorRegex = /(?:rgb\()(\d+,)\s*(\d+,)\s*(\d+)(?:\))/

const ThemeableColorConfig = v.object({
  50: v.pipe(v.string(), v.regex(themeableColorRegex)),
  100: v.pipe(v.string(), v.regex(themeableColorRegex)),
  200: v.pipe(v.string(), v.regex(themeableColorRegex)),
  300: v.pipe(v.string(), v.regex(themeableColorRegex)),
  400: v.pipe(v.string(), v.regex(themeableColorRegex)),
  500: v.pipe(v.string(), v.regex(themeableColorRegex)),
  600: v.pipe(v.string(), v.regex(themeableColorRegex)),
  700: v.pipe(v.string(), v.regex(themeableColorRegex)),
  800: v.pipe(v.string(), v.regex(themeableColorRegex)),
  900: v.pipe(v.string(), v.regex(themeableColorRegex)),
})

/**
 * Grabs all shaded colors from the primary palette and creates
 * a set of CSS variables and classes to enable theming parts of the website.
 *
 * @example
 * Basic usage
 *
 * ```tsx
 * <div className="theme-arpeggio-black">
 *  <div className="text-theme-500">I'm arpeggio black</div>
 *  <div className="theme-plushie-pink">
 *    <div className="text-theme-500">I'm plushie pink</div>
 *  </div>
 * </div>
 * ```
 */
export const pluginTheme = plugin(({ addComponents }) => {
  for (const name in colors) {
    const color = colors[name as keyof typeof colors]

    if (!v.is(ThemeableColorConfig, color)) {
      continue
    }

    const variants = Object.fromEntries(
      Object.entries(color).map(([key, value]) => [
        `--theme-${key}`,
        value.replace(themeableColorRegex, "$1 $2 $3"),
      ]),
    )

    addComponents({
      [`.theme-${name}`]: variants,
    })
  }
})

type PluginAPIThemeFunction = PluginAPI["theme"]

function filterDefault(values: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => key !== "DEFAULT"),
  )
}

/**
 * A modification of [`tailwindcss-animate`](https://github.com/jamiebuilds/tailwindcss-animate).
 *
 * It adds the `animation-` prefix to all the original plugin classes
 * to prevent conflicts with Tailwind `transition` utilities.
 */
export const pluginAnimation = plugin(
  ({ addUtilities, matchUtilities, theme }) => {
    addUtilities({
      "@keyframes enter": theme("keyframes.enter"),
      "@keyframes exit": theme("keyframes.exit"),
      ".animation-in": {
        animationName: "enter",
        animationDuration: theme("animationDuration.DEFAULT"),
        "--tw-enter-opacity": "initial",
        "--tw-enter-scale": "initial",
        "--tw-enter-rotate": "initial",
        "--tw-enter-translate-x": "initial",
        "--tw-enter-translate-y": "initial",
      },
      ".animation-out": {
        animationName: "exit",
        animationDuration: theme("animationDuration.DEFAULT"),
        "--tw-exit-opacity": "initial",
        "--tw-exit-scale": "initial",
        "--tw-exit-rotate": "initial",
        "--tw-exit-translate-x": "initial",
        "--tw-exit-translate-y": "initial",
      },
    })

    matchUtilities(
      {
        "animation-fade-in": (value) => ({ "--tw-enter-opacity": value }),
        "animation-fade-out": (value) => ({ "--tw-exit-opacity": value }),
      },
      { values: theme("animationOpacity") },
    )

    matchUtilities(
      {
        "animation-zoom-in": (value) => ({ "--tw-enter-scale": value }),
        "animation-zoom-out": (value) => ({ "--tw-exit-scale": value }),
      },
      { values: theme("animationScale") },
    )

    matchUtilities(
      {
        "animation-spin-in": (value) => ({ "--tw-enter-rotate": value }),
        "animation-spin-out": (value) => ({ "--tw-exit-rotate": value }),
      },
      { values: theme("animationRotate") },
    )

    matchUtilities(
      {
        "animation-slide-in-from-top": (value) => ({
          "--tw-enter-translate-y": `-${value}`,
        }),
        "animation-slide-in-from-bottom": (value) => ({
          "--tw-enter-translate-y": value,
        }),
        "animation-slide-in-from-left": (value) => ({
          "--tw-enter-translate-x": `-${value}`,
        }),
        "animation-slide-in-from-right": (value) => ({
          "--tw-enter-translate-x": value,
        }),
        "animation-slide-out-to-top": (value) => ({
          "--tw-exit-translate-y": `-${value}`,
        }),
        "animation-slide-out-to-bottom": (value) => ({
          "--tw-exit-translate-y": value,
        }),
        "animation-slide-out-to-left": (value) => ({
          "--tw-exit-translate-x": `-${value}`,
        }),
        "animation-slide-out-to-right": (value) => ({
          "--tw-exit-translate-x": value,
        }),
      },
      { values: theme("animationTranslate") },
    )

    matchUtilities(
      {
        "animation-duration": (value) => ({ animationDuration: String(value) }),
      },
      { values: filterDefault(theme("animationDuration")) },
    )

    matchUtilities(
      { "animation-delay": (value) => ({ animationDelay: value }) },
      { values: theme("animationDelay") },
    )

    matchUtilities(
      {
        "animation-ease": (value) => ({
          animationTimingFunction: String(value),
        }),
      },
      { values: filterDefault(theme("animationTimingFunction")) },
    )

    addUtilities({
      ".animation-run": { animationPlayState: "running" },
      ".animation-pause": { animationPlayState: "paused" },
    })

    matchUtilities(
      {
        "animation-fill-mode": (value) => ({
          animationFillMode: String(value),
        }),
      },
      { values: theme("animationFillMode") },
    )

    matchUtilities(
      {
        "animation-direction": (value) => ({
          animationDirection: String(value),
        }),
      },
      { values: theme("animationDirection") },
    )

    matchUtilities(
      {
        "animation-repeat": (value) => ({
          animationIterationCount: String(value),
        }),
      },
      { values: theme("animationRepeat") },
    )
  },
  {
    theme: {
      extend: {
        animationDelay: ({ theme }: { theme: PluginAPIThemeFunction }) => ({
          ...theme("transitionDelay"),
        }),
        animationDuration: ({ theme }: { theme: PluginAPIThemeFunction }) => ({
          0: "0ms",
          ...theme("transitionDuration"),
        }),
        animationTimingFunction: ({
          theme,
        }: {
          theme: PluginAPIThemeFunction
        }) => ({
          ...theme("transitionTimingFunction"),
        }),
        animationFillMode: {
          none: "none",
          forwards: "forwards",
          backwards: "backwards",
          both: "both",
        },
        animationDirection: {
          normal: "normal",
          reverse: "reverse",
          alternate: "alternate",
          "alternate-reverse": "alternate-reverse",
        },
        animationOpacity: ({ theme }: { theme: PluginAPIThemeFunction }) => ({
          DEFAULT: 0,
          ...theme("opacity"),
        }),
        animationTranslate: ({ theme }: { theme: PluginAPIThemeFunction }) => ({
          DEFAULT: "100%",
          ...theme("translate"),
        }),
        animationScale: ({ theme }: { theme: PluginAPIThemeFunction }) => ({
          DEFAULT: 0,
          ...theme("scale"),
        }),
        animationRotate: ({ theme }: { theme: PluginAPIThemeFunction }) => ({
          DEFAULT: "30deg",
          ...theme("rotate"),
        }),
        animationRepeat: {
          0: "0",
          1: "1",
          infinite: "infinite",
        },
        keyframes: {
          enter: {
            from: {
              opacity: "var(--tw-enter-opacity, 1)",
              transform:
                "translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))",
            },
          },
          exit: {
            to: {
              opacity: "var(--tw-exit-opacity, 1)",
              transform:
                "translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))",
            },
          },
        },
      },
    },
  },
)
