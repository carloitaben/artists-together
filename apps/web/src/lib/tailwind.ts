import resolveConfig from "tailwindcss/resolveConfig"
import config from "../../tailwind.config"

export const tailwind = resolveConfig(config)

export type Screens = typeof tailwind.theme.screens

export type Screen = keyof Screens