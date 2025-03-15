import type { JSONSchema } from "json-schema-to-ts";
export default {
  $id: "urn:jsonschema:data",
  items: { $ref: "urn:jsonschema:page" },
  type: "array",
} as const satisfies JSONSchema;
