import type { JSONSchema } from "json-schema-to-ts";
export default {
  $id: "urn:jsonschema:data",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  items: { $ref: "urn:jsonschema:page" },
  type: "array",
} as const satisfies JSONSchema;
