import Feed from "jsonfeed-schema/schema-v1.1.json";

export default {
  $id: "urn:jsonschema:feed",
  dynamicDefaults: { id: "uuid" },
  ...Feed,
};
