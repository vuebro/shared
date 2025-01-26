import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import useFlatJsonTree from "@vues3/flat-json-tree";
import AJV from "ajv";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults";
import { v4 } from "uuid";
import { reactive, watch } from "vue";

import Credentials from "./src/credentials";
import Data from "./src/data";
import Importmap from "./src/importmap";
import Page from "./src/page";

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

type TCredentials = FromSchema<typeof Credentials>;

type TImportmap = FromSchema<typeof Importmap>;

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

dynamicDefaults.DEFAULTS.uuid = () => () => v4();

/* -------------------------------------------------------------------------- */

const $children = {
    get(this: TPage) {
      return this.children.filter(({ enabled }) => enabled);
    },
  },
  $index = {
    get(this: TPage) {
      return this.$siblings.findIndex(({ id }) => this.id === id);
    },
  },
  $next = {
    get(this: TPage) {
      return this.$siblings[this.$index + 1];
    },
  },
  $prev = {
    get(this: TPage) {
      return this.$siblings[this.$index - 1];
    },
  },
  $siblings = {
    get(this: TPage) {
      return this.siblings.filter(({ enabled }) => enabled);
    },
  },
  i = {
    get(this: TPage) {
      return this.icon && `i-${this.icon}`;
    },
  },
  path = {
    get(this: TPage) {
      const branch = this.branch.slice(1);
      return branch.some(({ name }) => !name)
        ? undefined
        : branch
            .map(({ name }) => name)
            .join("/")
            .replaceAll(" ", "_");
    },
  },
  title = {
    get(this: TPage) {
      return this.header ?? this.name;
    },
  },
  to = {
    get(this: TPage) {
      return (this.loc?.replaceAll(" ", "_") ?? this.path)
        ?.replace(/^\/?/, "/")
        .replace(/\/?$/, "/");
    },
  };

const esm = true;

const code = { esm },
  coerceTypes = true,
  keywords = [dynamicDefaults()],
  removeAdditional = true,
  schemas = [Credentials, Data, Page, Importmap],
  useDefaults = true;

const ajv = new AJV({
    code,
    coerceTypes,
    keywords,
    removeAdditional,
    schemas,
    useDefaults,
  }),
  validateData = ajv.getSchema("urn:jsonschema:data"),
  validateImportmap = ajv.getSchema("urn:jsonschema:importmap");

const consoleError = (error: unknown) => {
    window.console.error(error);
  },
  customFetch = async (url: string) => (await fetch(url)).text(),
  deep = true,
  getFonts = (fonts: string[]) =>
    Object.fromEntries(
      fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
    ),
  importmap = reactive({}),
  nodes = reactive([]),
  validateCredentials = ajv.getSchema("urn:jsonschema:credentials"),
  {
    add,
    down,
    leaves: pages,
    left,
    remove,
    right,
    up,
  } = useFlatJsonTree(nodes) as IFlatJsonTree;

/* -------------------------------------------------------------------------- */

watch(pages, async (value) => {
  await validateData?.(value);
});

watch(importmap, async (value) => {
  await validateImportmap?.(value);
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

/* -------------------------------------------------------------------------- */

export type { TCredentials, TImportmap, TPage };

export {
  add,
  consoleError,
  customFetch,
  deep,
  down,
  getFonts,
  importmap,
  left,
  nodes,
  pages,
  remove,
  right,
  up,
  validateCredentials,
};
