import type { JSONSchema } from "json-schema-to-ts";

export default {
  $id: "importmap",
  additionalProperties: false,
  properties: {
    imports: {
      additionalProperties: { type: "string" },
      default: {},
      type: "object",
    },
    scopes: {
      additionalProperties: {
        additionalProperties: {
          type: "string",
        },
        type: "object",
      },
      type: "object",
    },
  },
  type: "object",
} as const satisfies JSONSchema;
