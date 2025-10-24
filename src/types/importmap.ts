import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */
/*                   Схема данных для файла index.importmap                   */
/* -------------------------------------------------------------------------- */

export default {
  properties: {
    scopes: {
      additionalProperties: {
        additionalProperties: {
          type: "string",
        },
        type: "object",
      },
      type: "object",
    },
    imports: {
      additionalProperties: { type: "string" },
      type: "object",
      default: {},
    },
  },
  $id: "urn:jsonschema:importmap",
  additionalProperties: false,
  type: "object",
} as const satisfies JSONSchema;
