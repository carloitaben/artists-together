export const domain =
  {
    production: "artiststogether.online",
    dev: "dev.artiststogether.online",
  }[$app.stage] || $app.stage + ".dev.artiststogether.online"

// export const zone = cloudflare.getZoneOutput({
//   name: "artiststogether.online",
// })
