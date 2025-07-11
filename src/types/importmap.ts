import type { JSONSchema } from "json-schema-to-ts";

export default {
  $id: "urn:jsonschema:importmap",
  additionalProperties: false,
  properties: {
    imports: {
      additionalProperties: { type: "string" },
      default: {},
      description: "The Imports field",
      type: "object",
    },
    scopes: {
      additionalProperties: {
        additionalProperties: {
          type: "string",
        },
        type: "object",
      },
      description: "The Scopes field",
      type: "object",
    },
  },
  title: "JSON schema for Import Maps files",
  type: "object",
} as const satisfies JSONSchema;
