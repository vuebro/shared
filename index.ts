/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import type { CodeOptions, CurrentOptions } from "ajv/dist/core";
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
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

interface IFlatJsonTree {
  add: (pId: string) => string | undefined;
  down: (pId: string) => void;
  leaves: ComputedRef<TPage[]>;
  left: (pId: string) => string | undefined;
  remove: (pId: string) => string | undefined;
  right: (pId: string) => string | undefined;
  up: (pId: string) => void;
}

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

const esm: CodeOptions["esm"] = true;

/* -------------------------------------------------------------------------- */

const coerceTypes: CurrentOptions["coerceTypes"] = true;

/* -------------------------------------------------------------------------- */

const removeAdditional: CurrentOptions["removeAdditional"] = true;

/* -------------------------------------------------------------------------- */

const useDefaults: CurrentOptions["useDefaults"] = true;

/* -------------------------------------------------------------------------- */
/*                                  Reactives                                 */
/* -------------------------------------------------------------------------- */

const importmap: Reactive<TImportmap> = reactive({} as TImportmap);

/* -------------------------------------------------------------------------- */

const data: Reactive<TPage[]> = reactive([]);

/* -------------------------------------------------------------------------- */
/*                                   Arrays                                   */
/* -------------------------------------------------------------------------- */

const keywords: CurrentOptions["keywords"] = [dynamicDefaults()];

/* -------------------------------------------------------------------------- */

const schemas: CurrentOptions["schemas"] = [Credentials, Data, Page, Importmap];

/* -------------------------------------------------------------------------- */
/*                                   Objects                                  */
/* -------------------------------------------------------------------------- */

const code: CurrentOptions["code"] = { esm };

/* -------------------------------------------------------------------------- */

const ajv: Ajv = new Ajv({
  code,
  coerceTypes,
  keywords,
  removeAdditional,
  schemas,
  useDefaults,
});

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

const {
  add,
  down,
  leaves: pages,
  left,
  remove,
  right,
  up,
}: IFlatJsonTree = useFlatJsonTree(data) as unknown as IFlatJsonTree;

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

const consoleError = (error: unknown): void => {
  window.console.error(error);
};

/* -------------------------------------------------------------------------- */

const customFetch = async (url: string): Promise<string> =>
  (await fetch(url)).text();

/* -------------------------------------------------------------------------- */

const getFonts = (fonts: string[]): Record<string, string> =>
  Object.fromEntries(
    fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
  );

/* -------------------------------------------------------------------------- */
/*                                  Watchers                                  */
/* -------------------------------------------------------------------------- */

watch(pages, async (value) => {
  await validateData?.(value);
});

/* -------------------------------------------------------------------------- */

watch(importmap, async (value) => {
  await validateImportmap?.(value);
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

/* -------------------------------------------------------------------------- */

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
