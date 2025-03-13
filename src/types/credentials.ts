import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */

const $id = "urn:jsonschema:credentials",
  nullable = true,
  type = "object",
  additionalProperties = {
    properties: {
      accessKeyId: { default: null, nullable, type: "string" },
      Bucket: { default: null, nullable, type: "string" },
      endpoint: { default: null, nullable, type: "string" },
      region: { default: null, nullable, type: "string" },
      secretAccessKey: { default: null, nullable, type: "string" },
    },
    type,
  } as const;

/* -------------------------------------------------------------------------- */

export default {
  $id,
  additionalProperties,
  type,
} as const satisfies JSONSchema;
