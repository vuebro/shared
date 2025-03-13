import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import useFlatJsonTree from "@vues3/flat-json-tree";
import AJV from "ajv";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults";
import { v4 } from "uuid";
import { reactive, watch } from "vue";

import Credentials from "./types/credentials";
import Data from "./types/data";
import Importmap from "./types/importmap";
import Page from "./types/page";

/* -------------------------------------------------------------------------- */

interface IFlatJsonTree {
  add: (pId: string) => string | undefined;
  down: (pId: string) => void;
  leaves: ComputedRef<TPage[]>;
  left: (pId: string) => string | undefined;
  objLeaves: Record<string, TPage>;
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
  esm = true,
  code = { esm },
  coerceTypes = true,
  keywords = [dynamicDefaults()],
  removeAdditional = true,
  schemas = [Credentials, Data, Page, Importmap],
  useDefaults = true,
  ajv = new AJV({
    code,
    coerceTypes,
    keywords,
    removeAdditional,
    schemas,
    useDefaults,
  }),
  deep = true,
  i = {
    get(this: TPage) {
      return this.icon && `i-${this.icon}`;
    },
  },
  importmap = reactive({} as TImportmap),
  nodes = reactive([] as TPage[]),
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
      return ["", undefined].includes(this.header) ? this.name : this.header;
    },
  },
  to = {
    get(this: TPage) {
      return (this.loc?.replaceAll(" ", "_") ?? this.path)
        ?.replace(/^\/?/, "/")
        .replace(/\/?$/, "/");
    },
  },
  validateCredentials = ajv.getSchema("urn:jsonschema:credentials"),
  validateData = ajv.getSchema("urn:jsonschema:data"),
  validateImportmap = ajv.getSchema("urn:jsonschema:importmap");

const {
  add,
  down,
  leaves: pages,
  left,
  objLeaves: atlas,
  remove,
  right,
  up,
} = useFlatJsonTree(nodes) as unknown as IFlatJsonTree;

const consoleError = (error: unknown) => {
    window.console.error(error);
  },
  customFetch = async (url: string) => (await fetch(url)).text(),
  getFontsObjectFromArray = (fonts: string[]) =>
    Object.fromEntries(
      fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
    );

/* -------------------------------------------------------------------------- */

watch(importmap, async (value) => {
  if (!(await validateImportmap?.(value))) importmap.imports = {};
});

watch(pages, async (value) => {
  if (!(await validateData?.(value))) {
    nodes.length = 0;
    nodes.push({} as TPage);
  } else
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
  atlas,
  consoleError,
  customFetch,
  deep,
  down,
  getFontsObjectFromArray,
  importmap,
  left,
  nodes,
  pages,
  remove,
  right,
  up,
  validateCredentials,
};
