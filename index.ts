/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import type { AnyValidateFunction } from "ajv/dist/types";
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
import Page from "./src/page";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type TCredentials = FromSchema<typeof Credentials>;

/* -------------------------------------------------------------------------- */

type TImportmap = FromSchema<typeof Importmap>;

/* -------------------------------------------------------------------------- */

type TPage = FromSchema<typeof Page> & {
  $children?: TPage[];
  $index: number;
  $next?: TPage;
  $prev?: TPage;
  $siblings: TPage[];
  branch: TPage[];
  children: TPage[];
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

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const ajv = (() => {
  const esm = true;
  const code = { esm };
  const coerceTypes = true;
  const keywords = [dynamicDefaults()];
  const removeAdditional = true;
  const schemas = [Credentials, Data, Page, Importmap];
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

/* -------------------------------------------------------------------------- */

const validateCredentials: AnyValidateFunction | null =
  ajv.getSchema("urn:jsonschema:credentials") ?? null;

/* -------------------------------------------------------------------------- */

const validateData: AnyValidateFunction | null =
  ajv.getSchema("urn:jsonschema:data") ?? null;

/* -------------------------------------------------------------------------- */

const validateImportmap: AnyValidateFunction | null =
  ajv.getSchema("urn:jsonschema:importmap") ?? null;

/* -------------------------------------------------------------------------- */

const deep = true;

/* -------------------------------------------------------------------------- */

const $children: PropertyDescriptor = {
  get(this: TPage) {
    return this.children.filter(({ enabled }) => enabled);
  },
};

/* -------------------------------------------------------------------------- */

const $siblings: PropertyDescriptor = {
  get(this: TPage) {
    return this.siblings.filter(({ enabled }) => enabled);
  },
};

/* -------------------------------------------------------------------------- */

const $index: PropertyDescriptor = {
  get(this: TPage) {
    return this.$siblings.findIndex(({ id }) => this.id === id);
  },
};

/* -------------------------------------------------------------------------- */

const $prev: PropertyDescriptor = {
  get(this: TPage) {
    return this.$siblings[this.$index - 1];
  },
};

/* -------------------------------------------------------------------------- */

const $next: PropertyDescriptor = {
  get(this: TPage) {
    return this.$siblings[this.$index + 1];
  },
};

/* -------------------------------------------------------------------------- */

const path: PropertyDescriptor = {
  get(this: TPage) {
    const branch = this.branch.slice(1);
    return branch.some(({ name }) => !name)
      ? undefined
      : branch
          .map(({ name }) => name)
          .join("/")
          .replaceAll(" ", "_");
  },
};

/* -------------------------------------------------------------------------- */

const to: PropertyDescriptor = {
  get(this: TPage) {
    return (this.loc?.replaceAll(" ", "_") ?? this.path)
      ?.replace(/^\/?/, "/")
      .replace(/\/?$/, "/");
  },
};

/* -------------------------------------------------------------------------- */

const i: PropertyDescriptor = {
  get(this: TPage) {
    return this.icon && `i-${this.icon}`;
  },
};

/* -------------------------------------------------------------------------- */

const title: PropertyDescriptor = {
  get(this: TPage) {
    return this.header ?? this.name;
  },
};

/* -------------------------------------------------------------------------- */
/*                                 References                                 */
/* -------------------------------------------------------------------------- */

const importmap: Reactive<TImportmap> = reactive({} as TImportmap);

/* -------------------------------------------------------------------------- */

const data: Reactive<TPage[]> = reactive([]);

/* -------------------------------------------------------------------------- */
/*                                 Composables                                */
/* -------------------------------------------------------------------------- */

const flatJsonTree = useFlatJsonTree(data);

/* -------------------------------------------------------------------------- */
/*                                 References                                 */
/* -------------------------------------------------------------------------- */

const { leaves: pages } = flatJsonTree as unknown as {
  leaves: ComputedRef<TPage[]>;
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

const { add, down, left, remove, right, up } = flatJsonTree;

/* -------------------------------------------------------------------------- */

const customFetch: (url: string) => Promise<string> = async (url) =>
  (await fetch(url)).text();

/* -------------------------------------------------------------------------- */

const getFonts: (fonts: string[]) => Record<string, string> = (fonts) =>
  Object.fromEntries(
    fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
  );

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */

dynamicDefaults.DEFAULTS.uuid = (): (() => string) => () => v4();

/* -------------------------------------------------------------------------- */

watch(pages, (value) => {
  validateData?.(value);
});

/* -------------------------------------------------------------------------- */

watch(importmap, (value) => {
  validateImportmap?.(value);
});

/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export type { TCredentials, TImportmap, TPage };
export {
  add,
  customFetch,
  data,
  deep,
  down,
  getFonts,
  importmap,
  left,
  pages,
  remove,
  right,
  up,
  validateCredentials,
};

/* -------------------------------------------------------------------------- */
