/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "Assets": {
      "type": "sst.cloudflare.Bucket"
    }
    "DatabaseToken": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DatabaseUrl": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DiscordBotId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DiscordBotToken": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DiscordServerId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "OAuthDiscordId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "OAuthDiscordSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "OAuthTwitchId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "OAuthTwitchSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
  }
}
export {}
