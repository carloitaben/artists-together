export type LocationCoordinate = `${number}` | `${number}.${number}`

export type Location = {
  name: string
  /**
   * https://github.com/omsrivastava/timezones-list/blob/master/src/timezones.json
   */
  timezone: string
  coordinates: [latitude: LocationCoordinate, longitude: LocationCoordinate]
}

export const locations: Location[] = [
  {
    name: "Stockholm, Sweden",
    timezone: "Europe/Stockholm",
    coordinates: ["59.32", "17.81"],
  },
  {
    name: "Toronto, Canada",
    timezone: "America/Toronto",
    coordinates: ["43.71", "-79.54"],
  },
  {
    name: "Lisbon, Portugal",
    timezone: "Europe/Lisbon",
    coordinates: ["38.74", "-9.20"],
  },
  {
    name: "Canberra, Australia",
    timezone: "Australia/Sydney",
    coordinates: ["-35.28", "149.12"],
  },
  {
    name: "Sapporo, Japan",
    timezone: "Asia/Tokyo",
    coordinates: ["-35.28", "149.12"],
  },
]
