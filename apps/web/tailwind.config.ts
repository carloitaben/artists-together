import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import radixPlugin from "tailwindcss-radix"
import noscriptPlugin from "tailwindcss-noscript"

function getFluidValue(value: string) {
  if (value.endsWith("rem")) {
    return parseFloat(value.replace("rem", "")) * 16
  }

  if (value.endsWith("px")) {
    return parseFloat(value.replace("rem", ""))
  }
}

const fluidPlugin = plugin(({ addVariant }) => {
  // @ts-expect-error This definitely exists but it's missing in Tailwind types
  addVariant("fluid", ({ container }) => {
    // @ts-expect-error This definitely exists but it's missing in Tailwind types
    container.walkRules((rule) => {
      rule.selector = `.fluid\\:${rule.selector.slice(1)}`

      // @ts-expect-error This definitely exists but it's missing in Tailwind types
      rule.walkDecls((decl) => {
        const value = getFluidValue(decl.value)
        if (typeof value === "number") {
          decl.value = `calc(${value * 100}vw / var(--fluid-viewport))`
        }
      })
    })
  })
})

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      sans: "Inter",
      serif: "Fraunces",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      "not-so-white": "#FAFAFA",
      black: "#000000",
      "not-so-black": "#0D0D0D",
      theme: {
        50: "rgba(var(--theme-50), <alpha-value>)",
        100: "rgba(var(--theme-100), <alpha-value>)",
        200: "rgba(var(--theme-200), <alpha-value>)",
        300: "rgba(var(--theme-300), <alpha-value>)",
        400: "rgba(var(--theme-400), <alpha-value>)",
        500: "rgba(var(--theme-500), <alpha-value>)",
        600: "rgba(var(--theme-600), <alpha-value>)",
        700: "rgba(var(--theme-700), <alpha-value>)",
        800: "rgba(var(--theme-800), <alpha-value>)",
        900: "rgba(var(--theme-900), <alpha-value>)",
      },
      "gunpla-white": {
        50: "#F4F4F4",
        100: "#E9EAEC",
        200: "#DDDFE0",
        300: "#CCD0D6",
        400: "#A4AAB2",
        500: "#676F7E",
        600: "#4F5664",
        700: "#3E424C",
        800: "#34363D",
        900: "#18191B",
      },
      "plushie-pink": {
        50: "#FFF0F4",
        100: "#FFD9E5",
        200: "#FEC3D9",
        300: "#FD96BC",
        400: "#FB5B98",
        500: "#F2267B",
        600: "#9F0F54",
        700: "#5E0D3A",
        800: "#420929",
        900: "#280316",
      },
      "froggy-lime": {
        50: "#FBFFE5",
        100: "#F4FFC2",
        200: "#E8FF8A",
        300: "#D4FF50",
        400: "#B8F50F",
        500: "#689400",
        600: "#446204",
        700: "#324507",
        800: "#223108",
        900: "#101703",
      },
      "smiley-yellow": {
        50: "#FEFBE7",
        100: "#FFF7BD",
        200: "#FFEC80",
        300: "#FFDC48",
        400: "#F7BE02",
        500: "#AC7002",
        600: "#814904",
        700: "#61360A",
        800: "#4B280B",
        900: "#210E03",
      },
      "microscopic-green": {
        50: "#E5FFE9",
        100: "#BDFFC8",
        200: "#85FF9B",
        300: "#48FF70",
        400: "#08FF48",
        500: "#009930",
        600: "#006620",
        700: "#05481A",
        800: "#063215",
        900: "#041B0C",
      },
      "ruler-cyan": {
        50: "#F0FAFF",
        100: "#DBF3FF",
        200: "#ADE9FF",
        300: "#6BDCFF",
        400: "#29CDFF",
        500: "#007CAD",
        600: "#005F85",
        700: "#01455F",
        800: "#053448",
        900: "#02141C",
      },
      "physical-orange": {
        50: "#FFF7EB",
        100: "#FFEFD1",
        200: "#FFDA9E",
        300: "#FFBD61",
        400: "#FF9F39",
        500: "#FF8B22",
        600: "#A23F06",
        700: "#7A2E0B",
        800: "#57220A",
        900: "#180802",
      },
      "sour-purple": {
        50: "#FFF5FF",
        100: "#FEDBFF",
        200: "#FDB8FF",
        300: "#FD85FF",
        400: "#FF42FF",
        500: "#F933FF",
        600: "#82087F",
        700: "#4D054C",
        800: "#2D062B",
        900: "#1C041A",
      },
      "acrylic-red": {
        50: "#FFF1F0",
        100: "#FFDAD6",
        200: "#FFBFB8",
        300: "#FF9185",
        400: "#FF5542",
        500: "#FF1800",
        600: "#B31200",
        700: "#7C0C00",
        800: "#5A0A01",
        900: "#1F0300",
      },
      "print-blue": {
        50: "#F0F2FF",
        100: "#DBDEFF",
        200: "#BDC2FF",
        300: "#8F94FF",
        400: "#575AFF",
        500: "#3924FF",
        600: "#1D0CA4",
        700: "#150877",
        800: "#10084E",
        900: "#040123",
      },
      "natural-khaki": {
        50: "#F3FAEB",
        100: "#DFF3CE",
        200: "#C5E9A5",
        300: "#9CD86F",
        400: "#77C440",
        500: "#3D6D21",
        600: "#2E5219",
        700: "#213814",
        800: "#182810",
        900: "#0C1607",
      },
      "milky-brown": {
        50: "#FBF6EF",
        100: "#F6EADA",
        200: "#ECD0B1",
        300: "#DFB081",
        400: "#D28951",
        500: "#A65730",
        600: "#894530",
        700: "#6A3525",
        800: "#46251B",
        900: "#210D0A",
      },
      "tuxedo-crimson": {
        50: "#FFF2F0",
        100: "#FFDBE2",
        200: "#FFBDC9",
        300: "#FF8A9F",
        400: "#FF4D6D",
        500: "#D90835",
        600: "#AD0028",
        700: "#930729",
        800: "#5B031B",
        900: "#270008",
      },
      "anamorphic-teal": {
        50: "#EDFDF7",
        100: "#CCFAEA",
        200: "#9CF6DD",
        300: "#76F7D8",
        400: "#0AC7B7",
        500: "#079D9D",
        600: "#0A4A57",
        700: "#024456",
        800: "#0A3743",
        900: "#011B23",
      },
      "outsider-violet": {
        50: "#F6EFFF",
        100: "#EEE1FF",
        200: "#E0CCFF",
        300: "#C59EFF",
        400: "#A666FF",
        500: "#8000DB",
        600: "#6B00BD",
        700: "#4D0085",
        800: "#2B0049",
        900: "#1B002D",
      },
      "arpeggio-black": {
        50: "#EFF5FF",
        100: "#D6E4FA",
        200: "#BCD1F6",
        300: "#9ABEFF",
        400: "#6793F8",
        500: "#4D6FD5",
        600: "#3B4881",
        700: "#2A3355",
        800: "#1E2333",
        900: "#0B0E1E",
      },
    },
    borderRadius: {
      none: "0px",
      sm: "0.125rem",
      DEFAULT: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      "4xl": "2rem",
      "5xl": "4rem",
      full: "9999px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        DEFAULT: "0px 4px 8px rgba(0, 0, 0, 0.08)",
        inner: "inset 0px 4px 8px rgba(0, 0, 0, 0.08)",
        button: "0px 4px 8px 0px rgba(11, 14, 30, 0.08)",
        card: "0px 8px 16px 0px rgba(11, 14, 30, 0.04)",
      },
      dropShadow: {
        button: "0px 4px 8px rgba(11, 14, 30, 0.08)",
        card: "0px 8px 16px rgba(11, 14, 30, 0.04)",
      },
    },
  },
  plugins: [radixPlugin, noscriptPlugin, fluidPlugin],
} satisfies Config
