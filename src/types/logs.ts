export default {
  $id: "urn:jsonschema:logs",
  additionalProperties: {
    properties: {
      messages: {
        default: [],
        items: {
          additionalProperties: false,
          dynamicDefaults: { timestamp: "timestamp" },
          properties: {
            content: {
              default: "[]",
              items: {
                additionalProperties: false,
                properties: {
                  text: { default: "", type: "string" },
                  type: { default: "text", type: "string" },
                },
                type: "object",
              },
              type: "array",
            },
            role: { default: "user", type: "string" },
            timestamp: { type: "integer" },
          },
          type: "object",
        },
        type: "array",
      },
      system: { default: "", type: "string" },
    },
    type: "object",
  },
  type: "object",
} as const;
