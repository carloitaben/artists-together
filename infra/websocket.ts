import { environment } from "./secret"

new sst.x.DevCommand("WebSocket Server", {
  dev: {
    command: "pnpm -F wss dev",
    autostart: false,
  },
  environment,
})
