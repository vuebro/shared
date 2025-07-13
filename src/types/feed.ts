export default {
  $id: "urn:jsonschema:feed",
  additionalProperties: false,
  properties: {
    feed_url: { type: "string" },
    home_page_url: { type: "string" },
    items: {
      default: [],
      items: {
        additionalProperties: false,
        dynamicDefaults: { date_published: "datetime", id: "uuid" },
        properties: {
          attachments: {
            default: [],
            items: {
              additionalProperties: false,
              properties: {
                mime_type: {
                  default: "",
                  type: "string",
                },
                url: {
                  default: "",
                  type: "string",
                },
              },
              required: ["url", "mime_type"],
              type: "object",
            },
            type: "array",
          },
          content_html: {
            default: "",
            type: "string",
          },
          date_published: { type: "string" },
          id: { type: "string" },
          title: {
            default: "",
            type: "string",
          },
          url: {
            default: "",
            type: "string",
          },
        },
        required: ["id", "title", "content_html"],
        type: "object",
      },
      type: "array",
    },
    title: {
      default: "",
      type: "string",
    },
    version: {
      default: "https://jsonfeed.org/version/1",
      enum: [
        "https://jsonfeed.org/version/1",
        "https://jsonfeed.org/version/1.1",
      ],
      type: "string",
    },
  },
  required: ["version", "title", "items"],
  type: "object",
} as const;
