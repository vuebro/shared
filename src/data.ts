import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */

const $id = "urn:jsonschema:data",
  items = { $ref: "urn:jsonschema:page" },
  type = "array";

/* -------------------------------------------------------------------------- */

export default { $id, items, type } as const satisfies JSONSchema;
