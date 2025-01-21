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
  $children: TPage[];
  $index: number;
  $next?: TPage;
  $prev?: TPage;
  $siblings: TPage[];
  branch: TPage[];
  children: TPage[];
  i?: string;
  index: number;
  next?: TPage;
  parent?: TPage;
  path?: string;
  prev?: TPage;
  siblings: TPage[];
  title?: string;
  to?: string;
};

/* -------------------------------------------------------------------------- */
/*                                    Init                                    */
/* -------------------------------------------------------------------------- */

dynamicDefaults.DEFAULTS.uuid = () => () => v4();

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const deep = true;

/* -------------------------------------------------------------------------- */
/*                                  Reactives                                 */
/* -------------------------------------------------------------------------- */

const importmap: Reactive<TImportmap> = reactive({} as TImportmap);

/* -------------------------------------------------------------------------- */

const data: Reactive<TPage[]> = reactive([]);

/* -------------------------------------------------------------------------- */
/*                                   Objects                                  */
/* -------------------------------------------------------------------------- */

const ajv: Ajv = (() => {
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

const isEnabled = ({ enabled }: TPage): boolean => enabled;

/* -------------------------------------------------------------------------- */

const $children: PropertyDescriptor = {
  get(this: TPage) {
    return this.children.filter(isEnabled);
  },
};

/* -------------------------------------------------------------------------- */

const $siblings: PropertyDescriptor = {
  get(this: TPage) {
    return this.siblings.filter(isEnabled);
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

const flatJsonTree = useFlatJsonTree(data);

/* -------------------------------------------------------------------------- */
/*                                Computations                                */
/* -------------------------------------------------------------------------- */

const { leaves: pages } = flatJsonTree as unknown as {
  leaves: ComputedRef<TPage[]>;
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

const validateCredentials: AnyValidateFunction | undefined = ajv.getSchema(
  "urn:jsonschema:credentials",
);

/* -------------------------------------------------------------------------- */

const validateData: AnyValidateFunction | undefined = ajv.getSchema(
  "urn:jsonschema:data",
);

/* -------------------------------------------------------------------------- */

const validateImportmap: AnyValidateFunction | undefined = ajv.getSchema(
  "urn:jsonschema:importmap",
);

/* -------------------------------------------------------------------------- */

const {
  add,
  down,
  left,
  remove,
  right,
  up,
}: {
  add: (pId: string) => string | undefined;
  down: (pId: string) => void;
  left: (pId: string) => string | undefined;
  remove: (pId: string) => string | undefined;
  right: (pId: string) => string | undefined;
  up: (pId: string) => void;
} = flatJsonTree;

/* -------------------------------------------------------------------------- */

const callValidateData = async (value: TPage[]): Promise<void> => {
  await validateData?.(value);
};

/* -------------------------------------------------------------------------- */

const callValidateImportmap = async (value: TImportmap): Promise<void> => {
  await validateImportmap?.(value);
};

/* -------------------------------------------------------------------------- */

const consoleError = (error: unknown): void => {
  window.console.error(error);
};

/* -------------------------------------------------------------------------- */

const customFetch = async (url: string): Promise<string> =>
  (await fetch(url)).text();

/* -------------------------------------------------------------------------- */

const getFontEntry = (value: string): [string, string] => [
  value.toLowerCase().replaceAll(" ", "_"),
  value,
];

/* -------------------------------------------------------------------------- */

const getFonts = (fonts: string[]): Record<string, string> =>
  Object.fromEntries(fonts.map(getFontEntry));

/* -------------------------------------------------------------------------- */

const defineProperties = (element: TPage): void => {
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
};

/* -------------------------------------------------------------------------- */

const pagesExtraProperties = (value: TPage[]): void => {
  value.forEach(defineProperties);
};

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */

watch(pages, callValidateData);

/* -------------------------------------------------------------------------- */

watch(importmap, callValidateImportmap);

/* -------------------------------------------------------------------------- */

watch(pages, pagesExtraProperties);

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export type { TCredentials, TImportmap, TPage };
export {
  add,
  consoleError,
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
