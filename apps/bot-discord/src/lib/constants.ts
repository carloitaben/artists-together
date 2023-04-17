import { env } from "./env"

export const APPLICATION_ID = "1097235077966073927"

export const CHANNELS =
  env.NODE_ENV === "development"
    ? {
        SERVER_MAP_AND_ROLES: "1097464220720840795",
      }
    : {
        SERVER_MAP_AND_ROLES: "780233965310181407",
      }

export const ROLES =
  env.NODE_ENV === "development"
    ? {
        PRONOUNS_THEY_THEM: "1097474639384555550",
        PRONOUNS_SHE_HER: "1097474589841436722",
        PRONOUNS_HE_HIM: "1097474617960042628",
      }
    : {
        PRONOUNS_THEY_THEM: "",
        PRONOUNS_SHE_HER: "",
        PRONOUNS_HE_HIM: "",
      }
