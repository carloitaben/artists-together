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
    coordinates: ["59.326038", "17.8172488"],
  },
  {
    name: "Toronto, Canada",
    timezone: "America/Toronto",
    coordinates: ["43.7181228", "-79.5428656"],
  },
  {
    name: "Lisbon, Portugal",
    timezone: "Europe/Lisbon",
    coordinates: ["38.7440505", "-9.2421367"],
  },
  {
    name: "Canberra, Australia",
    timezone: "Australia/Sydney",
    coordinates: ["-35.2897347", "149.1412762"],
  },
  {
    name: "Sapporo, Japan",
    timezone: "Asia/Tokyo",
    coordinates: ["42.9848631", "140.9183317"],
  },
]
