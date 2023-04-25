import { env } from "~/lib/env"

export const APPLICATION_ID = "1097235077966073927"

export const CHANNELS =
  env.NODE_ENV === "development"
    ? ({
        ART_EMERGENCIES: "1099334764835651624",
        INTRODUCTIONS: "1099296890538963016",
        ROLES: "1097464220720840795",
      } as const)
    : ({
        ART_EMERGENCIES: "",
        INTRODUCTIONS: "",
        ROLES: "",
      } as const)

export type Channels = typeof CHANNELS
export type Channel = Channels[keyof Channels]

export const ROLES =
  env.NODE_ENV === "development"
    ? ({
        LIVE_NOW: "1100357964772151317",
        FRIEND: "1099296505438937088",
        PRONOUNS_THEY_THEM: "1097474639384555550",
        PRONOUNS_SHE_HER: "1097474589841436722",
        PRONOUNS_HE_HIM: "1097474617960042628",
        REGION_AFRICA: "1099278497031127111",
        REGION_WEST_EUROPE: "1099278555466170399",
        REGION_EAST_EUROPE: "1099278586348847135",
        REGION_WEST_ASIA: "1099278615608315934",
        REGION_EAST_ASIA: "1099278644481900627",
        REGION_NORTH_AMERICA: "1099278670813728768",
        REGION_SOUTH_AMERICA: "1099278692678635520",
        REGION_OCEANIA: "1099278710760284240",
        REGION_CARIBBEAN: "1099278739977818132",
        REGION_MIDDLE_EAST: "1099278805065011331",
      } as const)
    : ({
        LIVE_NOW: "",
        FRIEND: "",
        PRONOUNS_THEY_THEM: "",
        PRONOUNS_SHE_HER: "",
        PRONOUNS_HE_HIM: "",
        REGION_AFRICA: "",
        REGION_WEST_EUROPE: "",
        REGION_EAST_EUROPE: "",
        REGION_WEST_ASIA: "",
        REGION_EAST_ASIA: "",
        REGION_NORTH_AMERICA: "",
        REGION_SOUTH_AMERICA: "",
        REGION_OCEANIA: "",
        REGION_CARIBBEAN: "",
        REGION_MIDDLE_EAST: "",
      } as const)

export type Roles = typeof ROLES
export type Role = Roles[keyof Roles]
