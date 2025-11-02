import type { JSONSchema } from "json-schema-to-ts";

export default {
  $id: "urn:jsonschema:fonts",
  items: { type: "string" },
  type: "array",
} as const satisfies JSONSchema;
