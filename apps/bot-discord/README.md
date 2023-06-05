# Pal @ Discord

The source code of the Discord integration of Pal (Programmable Artistic Life-form), the assistant bot for the Artist Together community.

## Development

It is highly recommended that you set up your own test bot and server for local development if you plan on working extensively with the codebase, since automated testing of Discord bots is very challenging and not worth the effort.

Start by [creating a Discord server](https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server) and then follow the instructions provided [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html) to create a bot application and add it to your server.

Create a `.env` file in the repository root directory with the contents of the `.env.example` file and put in values for every variable prefixed with `DISCORD`:

```shell
touch .env
```

Next run the `sync` command in order to configure your server to have the latest slash-commands definitions:

```shell
pnpm --filter bot-discord sync
```

You can now run the `dev` command to start the bot in development mode:

```shell
pnpm --filter bot-discord dev
```

> **Note**
> You will need to create channels and roles for several of the features. The error messages in your terminal will tell you which ones to create.
