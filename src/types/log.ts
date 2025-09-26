import type { JSONSchema } from "json-schema-to-ts";

export default {
  $id: "urn:jsonschema:log",
  additionalProperties: false,
  properties: {
    messages: {
      default: [],
      items: {
        additionalProperties: false,
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
        },
        type: "object",
      },
      type: "array",
    },
    system: { default: "", type: "string" },
  },
  type: "object",
} as const satisfies JSONSchema;
