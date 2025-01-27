export const Tag = {
  LiveUser: "live-user",
  LastInstagramPost: "last-instagram-post",
  WidgetContentShared: "widget-content-shared",
} as const

export type Tag = keyof typeof Tag
