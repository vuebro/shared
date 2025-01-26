import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */

const $id = "urn:jsonschema:importmap",
  additionalProperties = false,
  type = "object",
  properties = {
    imports: {
      additionalProperties: { type: "string" },
      default: {},
      type: "object",
    },
  } as const;

/* -------------------------------------------------------------------------- */

export default {
  $id,
  additionalProperties,
  properties,
  type,
} as const satisfies JSONSchema;
