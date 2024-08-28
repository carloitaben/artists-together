import { environment } from "./secret"

new sst.x.DevCommand("WebSocket", {
  dev: {
    command: "pnpm -F wss dev",
    autostart: false,
  },
  environment,
})
