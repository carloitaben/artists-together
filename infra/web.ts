import { environment } from "./secret"

export const assets = new sst.cloudflare.Bucket("Assets")

// export const assetsWriteToken = new cloudflare.ApiToken("AssetsToken", {
//   name: "AssetsWriteToken",
//   policies: [
//     {
//       effect: "allow",
//       resources: assets.nodes.bucket.name.apply((name) => ({
//         [`com.cloudflare.edge.r2.bucket.${sst.cloudflare.DEFAULT_ACCOUNT_ID}_default_${name}`]:
//           "*",
//       })),
//       permissionGroups: ["Workers R2 Storage Bucket Item Write"],
//     },
//   ],
// })

new sst.x.DevCommand("Web", {
  dev: {
    url: "http://localhost:3000",
    command: "pnpm -F web dev",
    autostart: true,
  },
  environment,
})

if (!$dev) {
  const web = new vercel.Project("ArtistsTogether", {
    name: "artists-together",
    framework: "nextjs",
    rootDirectory: "apps/web",
  })

  new vercel.Deployment("ArtistsTogetherWebDeployment", {
    projectId: web.id,
    production: $app.stage === "production",
    pathPrefix: process.cwd(),
    files: vercel.getProjectDirectoryOutput({
      path: process.cwd(),
    }).files,
    environment,
  })
}
