import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */
/*                   Схема данных для файла index.importmap                   */
/* -------------------------------------------------------------------------- */

export default {
  $id: "urn:jsonschema:importmap",
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
