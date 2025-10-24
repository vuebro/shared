import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */
/*                      Схема данных для файла index.json                     */
/* -------------------------------------------------------------------------- */

export default {
  items: { $ref: "urn:jsonschema:page" },
  $id: "urn:jsonschema:data",
  type: "array",
} as const satisfies JSONSchema;
