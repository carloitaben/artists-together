/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "artists-together",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: true,
        random: true,
        vercel: true,
      },
    }
  },
  async run() {
    const assets = new sst.cloudflare.Bucket("Assets")

    // const assetsToken = new cloudflare.ApiToken("AssetsToken", {
    //   name: "AssetsToken",
    //   policies: [
    //     {
    //       permissionGroups: [""],
    //       resources: {
    //         "": "*",
    //       },
    //     }
    //   ],
    // })

    const revalidationToken = new random.RandomString("RevalidationToken", {
      length: 16,
    })

    const secrets = {
      CLOUDFLARE_ACCOUNT_ID: sst.cloudflare.DEFAULT_ACCOUNT_ID,
      CLOUDFLARE_API_TOKEN: String(process.env.CLOUDFLARE_API_TOKEN),
      DATABASE_URL: new sst.Secret("DatabaseUrl", "http://127.0.0.1:8080")
        .value,
      DATABASE_TOKEN: new sst.Secret("DatabaseToken", "").value,
      DISCORD_SERVER_ID: new sst.Secret("DiscordServerId").value,
      DISCORD_BOT_TOKEN: new sst.Secret("DiscordBotToken").value,
      DISCORD_BOT_ID: new sst.Secret("DiscordBotId").value,
      OAUTH_DISCORD_ID: new sst.Secret("OAuthDiscordId").value,
      OAUTH_DISCORD_SECRET: new sst.Secret("OAuthDiscordSecret").value,
      OAUTH_TWITCH_ID: new sst.Secret("OAuthTwitchId").value,
      OAUTH_TWITCH_SECRET: new sst.Secret("OAuthTwitchSecret").value,
    }

    const environment = {
      ...secrets,
      BUCKET_ASSETS_NAME: assets.name,
      REVALIDATION_TOKEN: revalidationToken.result,
    }

    new sst.aws.Cron("WeatherCronJob", {
      job: {
        handler: "./apps/functions/src/cron-weather.handler",
        environment,
      },
      schedule: "rate(1 hour)",
    })

    new sst.x.DevCommand("Database", {
      dev: {
        command: "pnpm -F db dev",
        autostart: true,
      },
      environment,
    })

    new sst.x.DevCommand("Web", {
      dev: {
        url: "http://localhost:3000",
        command: "pnpm -F next dev",
        autostart: true,
      },
      environment,
    })

    if (!$dev) {
      const web = new vercel.Project("ArtistsTogetherWeb", {
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
  },
})
