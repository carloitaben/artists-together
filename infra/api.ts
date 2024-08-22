import { environment } from "./secret"

new sst.aws.Cron("WeatherCronJob", {
  job: {
    handler: "./apps/functions/src/cron-weather.handler",
    environment,
  },
  schedule: "rate(1 hour)",
})
