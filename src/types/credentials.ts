import type { JSONSchema } from "json-schema-to-ts";

/* -------------------------------------------------------------------------- */
/*                        Схема данных для AWS-клиента                        */
/* -------------------------------------------------------------------------- */

export default {
  additionalProperties: {
    properties: {
      secretAccessKey: { nullable: true, type: "string", default: null },
      accessKeyId: { nullable: true, type: "string", default: null },
      endpoint: { nullable: true, type: "string", default: null },
      Bucket: { nullable: true, type: "string", default: null },
      region: { nullable: true, type: "string", default: null },
    },
    type: "object",
  },
  $id: "urn:jsonschema:credentials",
  type: "object",
} as const satisfies JSONSchema;
