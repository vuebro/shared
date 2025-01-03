/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import type { JSONSchema } from "json-schema-to-ts";
import type { JSONSchemaType } from "json-schema-to-ts/lib/types/definitions/jsonSchema";

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const $id = "urn:jsonschema:credentials";

/* -------------------------------------------------------------------------- */

const nullable = true;

/* -------------------------------------------------------------------------- */

const type: JSONSchemaType = "object";

/* -------------------------------------------------------------------------- */

const additionalProperties = {
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

const credentials = {
  $id,
  additionalProperties,
  type,
} as const satisfies JSONSchema;

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export default credentials;

/* -------------------------------------------------------------------------- */
