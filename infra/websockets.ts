import { environment } from "./secret"

new sst.x.DevCommand("WebSockets", {
  dev: {
    command: "pnpm -F wss dev",
    autostart: false,
  },
  environment,
})
