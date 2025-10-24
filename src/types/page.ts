/* -------------------------------------------------------------------------- */
/*                Схема данных для объекта аттрибутов страницы                */
/* -------------------------------------------------------------------------- */

export default {
  properties: {
    type: {
      enum: [
        "article",
        "book",
        "profile",
        "website",
        "music.song",
        "music.album",
        "music.playlist",
        "music.radio_station",
        "video.movie",
        "video.episode",
        "video.tv_show",
        "video.other",
        null,
      ],
      nullable: true,
      type: "string",
      default: null,
    },
    images: {
      items: {
        properties: {
          url: { type: "string", default: "" },
          alt: { type: "string" },
        },
        additionalProperties: false,
        type: "object",
      },
      type: "array",
      default: [],
    },
    changefreq: {
      enum: [
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never",
        null,
      ],
      nullable: true,
      type: "string",
      default: null,
    },
    class: {
      default: ["prose", "max-w-none"],
      items: { type: "string" },
      description: "Классы",
      type: "array",
    },
    priority: {
      nullable: true,
      type: "number",
      default: null,
      maximum: 1,
      minimum: 0,
    },
    children: {
      items: { type: "object" },
      type: "array",
      default: [],
    },
    keywords: {
      items: { type: "string" },
      type: "array",
      default: [],
    },
    description: { nullable: true, type: "string", default: null },
    lastmod: { nullable: true, type: "string", default: null },
    name: { nullable: true, type: "string", default: null },
    loc: { nullable: true, type: "string", default: null },
    enabled: { type: "boolean", default: true },
    flat: { type: "boolean", default: true },
    header: { type: "string" },
    icon: { type: "string" },
    id: { type: "string" },
  },
  dynamicDefaults: { id: "uuid" },
  additionalProperties: false,
  $id: "urn:jsonschema:page",
  type: "object",
} as const;
