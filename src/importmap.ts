/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import type { JSONSchema } from "json-schema-to-ts";
import type { JSONSchemaType } from "json-schema-to-ts/lib/types/definitions/jsonSchema";

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const $id = "urn:jsonschema:importmap";

/* -------------------------------------------------------------------------- */

const additionalProperties: JSONSchema = false;

/* -------------------------------------------------------------------------- */

const properties = {
  imports: {
    additionalProperties: { type: "string" },
    default: {},
    type: "object",
  },
} as const;

/* -------------------------------------------------------------------------- */

const type: JSONSchemaType = "object";

/* -------------------------------------------------------------------------- */

const importmap = {
  $id,
  additionalProperties,
  properties,
  type,
} as const satisfies JSONSchema;

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export default importmap;

/* -------------------------------------------------------------------------- */
