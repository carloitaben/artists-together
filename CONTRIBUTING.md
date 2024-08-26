# Contributor Manual

> **Tip for new contributors:**
> Take a look at [https://github.com/firstcontributions/first-contributions](https://github.com/firstcontributions/first-contributions) for helpful information on contributing

## Quick Guide

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/)
- Cloudflare account
- AWS account

### Setting up your local repository

Clone the repository:

```shell
git clone https://github.com/carloitaben/artists-together.git
```

Enable [Corepack](https://nodejs.org/api/corepack.html):

```shell
corepack enable
```

Install workspace dependencies in the root directory:

```shell
pnpm install
```

### Setting up infrastructure providers

#### Setting up AWS

Follow [this tutorial](https://sst.dev/docs/iam-credentials/).

#### Setting up Cloudflare

- [Create an API Token](https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22dns%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22memberships%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22user_details%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_r2%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_routes%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_tail%22%2C%22type%22%3A%22read%22%7D%5D&name=sst&accountId=*&zoneId=all).
- Save the API token as a `CLOUDFLARE_API_TOKEN` environment variable in an `.env` file in the root of the monorepo.

#### Setting up Vercel

- [Create an API Token](https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token#creating-an-access-token).
- Save the API token as a `VERCEL_API_TOKEN` environment variable in an `.env` file in the root of the monorepo.
- Save the Team ID as a `VERCEL_TEAM` environment variable in an `.env` file in the root of the monorepo.

### Development

Run the monorepo in development mode:

```shell
pnpm sst dev
```

This will bring up the SST multiplexer with all basic services running in parallel. You can run the rest of the services by clicking on them an pressing enter.

> [!IMPORTANT]  
> Some services require setting secrets through SST. Refer to their respective README to learn more.
