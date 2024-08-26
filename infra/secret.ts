const revalidationToken = new random.RandomPassword("RevalidationToken", {
  length: 32,
})

export const secret = {
  DATABASE_URL: new sst.Secret("DatabaseUrl", "http://127.0.0.1:8080"),
  DATABASE_TOKEN: new sst.Secret("DatabaseToken", ""),
  DISCORD_SERVER_ID: new sst.Secret("DiscordServerId"),
  DISCORD_BOT_TOKEN: new sst.Secret("DiscordBotToken"),
  DISCORD_BOT_ID: new sst.Secret("DiscordBotId"),
  OAUTH_DISCORD_ID: new sst.Secret("OAuthDiscordId"),
  OAUTH_DISCORD_SECRET: new sst.Secret("OAuthDiscordSecret"),
  OAUTH_TWITCH_ID: new sst.Secret("OAuthTwitchId"),
  OAUTH_TWITCH_SECRET: new sst.Secret("OAuthTwitchSecret"),
}

export const environment = Object.assign(
  Object.fromEntries(
    Object.entries(secret).map(([key, secret]) => [key, secret.value])
  ),
  {
    CLOUDFLARE_ACCOUNT_ID: sst.cloudflare.DEFAULT_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: String(process.env.CLOUDFLARE_API_TOKEN),
    WEB_REVALIDATION_TOKEN: revalidationToken.result,
  }
)
