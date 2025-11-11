import type { JSONSchema } from "json-schema-to-ts";

export default {
  $id: "fonts",
  items: { type: "string" },
  type: "array",
} as const satisfies JSONSchema;
