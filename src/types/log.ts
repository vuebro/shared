import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */
/*                Схема данных для хранения диалога с чат-ботом               */
/* -------------------------------------------------------------------------- */

export default {
  properties: {
    messages: {
      items: {
        properties: {
          content: {
            items: {
              properties: {
                type: {
                  default: "text",
                  type: "string",
                },
                text: { type: "string", default: "" },
              },
              additionalProperties: false,
              type: "object",
            },
            type: "array",
            default: [],
          },
          role: {
            enum: ["user", "assistant", "system"],
            default: "user",
            type: "string",
          },
        },
        additionalProperties: false,
        type: "object",
      },
      type: "array",
      default: [],
    },
    system: { type: "string", default: "" },
  },
  additionalProperties: false,
  $id: "urn:jsonschema:log",
  type: "object",
} as const satisfies JSONSchema;
