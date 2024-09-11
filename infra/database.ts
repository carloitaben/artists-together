import { environment } from "./secret"

new sst.x.DevCommand("Database", {
  dev: {
    command: "pnpm -F core db:dev",
    autostart: true,
  },
  environment,
})

// new sst.x.DevCommand("Database Studio", {
//   dev: {
//     url: "https://local.drizzle.studio",
//     command: "pnpm -F db studio",
//     autostart: true,
//   },
//   environment,
// })
