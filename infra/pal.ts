import { environment } from "./secret"

new sst.x.DevCommand("Pal @ Discord", {
  dev: {
    command: "pnpm -F pal-discord dev",
    autostart: false,
  },
  environment,
})
