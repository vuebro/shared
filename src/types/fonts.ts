import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */
/*                     Схема данных для файла с fonts.json                    */
/* -------------------------------------------------------------------------- */

export default {
  $id: "urn:jsonschema:fonts",
  items: { type: "string" },
  type: "array",
} as const satisfies JSONSchema;
