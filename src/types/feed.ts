/* -------------------------------------------------------------------------- */
/*                         Схема данных для JSON Feed                         */
/* -------------------------------------------------------------------------- */

export default {
  properties: {
    items: {
      items: {
        properties: {
          attachments: {
            items: {
              properties: {
                mime_type: {
                  type: "string",
                  default: "",
                },
                url: {
                  type: "string",
                  default: "",
                },
              },
              additionalProperties: false,
              type: "object",
            },
            type: "array",
            default: [],
          },
          content_html: {
            type: "string",
            default: "",
          },
          title: {
            type: "string",
            default: "",
          },
          date_published: { type: "string" },
          url: { type: "string" },
          id: { type: "string" },
        },
        dynamicDefaults: { date_published: "datetime", id: "uuid" },
        additionalProperties: false,
        type: "object",
      },
      type: "array",
      default: [],
    },
    version: {
      enum: [
        "https://jsonfeed.org/version/1",
        "https://jsonfeed.org/version/1.1",
      ],
      default: "https://jsonfeed.org/version/1",
      type: "string",
    },
    title: {
      type: "string",
      default: "",
    },
    home_page_url: { type: "string" },
    feed_url: { type: "string" },
  },
  additionalProperties: false,
  $id: "urn:jsonschema:feed",
  type: "object",
} as const;
