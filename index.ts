import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef, Reactive } from "vue";

import useFlatJsonTree from "@vues3/flat-json-tree";
import Ajv from "ajv";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults";
import { v4 } from "uuid";
import { reactive, watch } from "vue";

import Credentials from "./src/credentials";
import Data from "./src/data";
import Importmap from "./src/importmap";
import Page, { plainPage } from "./src/page";

export type TPage = FromSchema<typeof plainPage> & {
  $children?: TPage[];
  $index: number;
  $next?: TPage;
  $prev?: TPage;
  $siblings: TPage[];
  branch: TPage[];
  children?: TPage[];
  i: string;
  index: number;
  next?: TPage;
  parent?: TPage;
  path?: string;
  prev?: TPage;
  root: TPage;
  siblings: TPage[];
  title: string;
  to?: string;
};
dynamicDefaults.DEFAULTS.uuid = (): (() => string) => () => v4();
export type TCredentials = FromSchema<typeof Credentials>;
export type TImportmap = FromSchema<typeof Importmap>;
const ajv = (() => {
  const esm = true;
  const code = { esm };
  const coerceTypes = true;
  const keywords = [dynamicDefaults()];
  const removeAdditional = true;
  const schemas = [Credentials, Page, Data, Importmap];
  const useDefaults = true;
  return new Ajv({
    code,
    coerceTypes,
    keywords,
    removeAdditional,
    schemas,
    useDefaults,
  });
})();
export const validatePage = ajv.getSchema("urn:jsonschema:page");
export const validateCredentials = ajv.getSchema("urn:jsonschema:credentials");
const validateData = ajv.getSchema("urn:jsonschema:data");
const validateImportmap = ajv.getSchema("urn:jsonschema:importmap");
export const deep = true;
export const importmap = reactive({} as TImportmap);
export const data: Reactive<TPage[]> = reactive([]);
export const customFetch = async (url: string) => (await fetch(url)).text();
const flatJsonTree = useFlatJsonTree(data);
export const { add, down, left, remove, right, up } = flatJsonTree;
export const { leaves: pages } = flatJsonTree as unknown as {
  leaves: ComputedRef<TPage[]>;
};
const $children = {
  get(this: TPage) {
    return this.children?.filter(({ enabled }) => enabled);
  },
};
const $siblings = {
  get(this: TPage) {
    return this.siblings.filter(({ enabled }) => enabled);
  },
};
const $index = {
  get(this: TPage) {
    return this.$siblings.findIndex(({ id }) => this.id === id);
  },
};
const $prev = {
  get(this: TPage) {
    return this.$siblings[this.$index - 1];
  },
};
const $next = {
  get(this: TPage) {
    return this.$siblings[this.$index + 1];
  },
};
const path = {
  get(this: TPage) {
    return this.branch
      .slice(1)
      .map(({ name }) => name ?? "-")
      .join("/")
      .replaceAll(" ", "_");
  },
};
const to = {
  get(this: TPage) {
    return (this.loc?.replaceAll(" ", "_") ?? this.path)
      ?.replace(/^\/?/, "/")
      .replace(/\/?$/, "/");
  },
};
const i = {
  get(this: TPage) {
    return this.icon && `i-${this.icon}`;
  },
};
const title = {
  get(this: TPage) {
    return this.header ?? this.name;
  },
};
watch(data, (value) => {
  validateData?.(value) as boolean;
});
watch(importmap, (value) => {
  validateImportmap?.(value) as boolean;
});
watch(pages, (value) => {
  value.forEach((element) => {
    Object.defineProperties(element, {
      $children,
      $index,
      $next,
      $prev,
      $siblings,
      i,
      path,
      title,
      to,
    });
  });
});
export const getFonts = (fonts: string[]) =>
  Object.fromEntries(
    fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
  );
