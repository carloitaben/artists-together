import "dotenv-mono/load"
import { seed } from "drizzle-seed"
import {
  database,
  userTable,
  locationTable,
  weatherTable,
} from "../src/database"

await seed(database, {
  userTable,
  locationTable,
  weatherTable,
}).refine((f) => ({
  userTable: {
    columns: {
      id: f.int({
        minValue: 10000,
        maxValue: 20000,
        isUnique: true,
      }),
      avatar: f.valuesFromArray({
        values: ["https://picsum.photos/200"],
      }),
      username: f.firstName(),
      pronouns: f.valuesFromArray({
        values: ["she/her", "he/him", "they/them"],
      }),
      settings: f.valuesFromArray({
        values: [
          JSON.stringify({
            fahrenheit: Math.random() > 0.5,
            fullHourFormat: Math.random() > 0.5,
            shareCursor: Math.random() > 0.5,
            shareStreaming: Math.random() > 0.5,
          }),
        ],
      }),
    },
  },
  locationTable: {
    with: {
      weatherTable: 1,
    },
    columns: {
      city: f.city(),
      country: f.country(),
      continent: f.valuesFromArray({
        values: ["Africa", "America", "Asia", "Europe", "Oceania"],
      }),
      latitude: f.int({ minValue: -90, maxValue: 90 }),
      longitude: f.int({ minValue: -180, maxValue: 180 }),
      timezone: f.valuesFromArray({
        values: [
          "America/Chicago",
          "Australia/Sydney",
          "Asia/Tokyo",
          "Europe/Berlin",
        ],
      }),
      createdAt: f.timestamp(),
      updatedAt: f.timestamp(),
    },
  },
  weatherTable: {
    columns: {
      todayMin: f.int({ minValue: -10, maxValue: 40 }),
      todayMax: f.int({ minValue: -10, maxValue: 40 }),
      tomorrowMin: f.int({ minValue: -10, maxValue: 40 }),
      tomorrowMax: f.int({ minValue: -10, maxValue: 40 }),
      todayWeatherCode: f.valuesFromArray({
        values: [0, 1, 45, 51, 56, 61, 66, 71, 77, 80, 85, 95, 99],
      }),
      tomorrowWeatherCode: f.valuesFromArray({
        values: [0, 1, 45, 51, 56, 61, 66, 71, 77, 80, 85, 95, 99],
      }),
      createdAt: f.timestamp(),
      updatedAt: f.timestamp(),
    },
  },
}))
