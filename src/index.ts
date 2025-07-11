import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import useFlatJsonTree from "@vuebro/flat-json-tree";
import AJV from "ajv";
import addFormats from "ajv-formats";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults.js";
import { reactive, watch } from "vue";

import Credentials from "./types/credentials";
import Data from "./types/data";
import Feed from "./types/feed";
import Importmap from "./types/importmap";
import Page from "./types/page";

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
type TCredentials = FromSchema<typeof Credentials>;
type TFeed = FromSchema<typeof Feed>;
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

const uid = () => {
  const url = URL.createObjectURL(new Blob()),
    id = url.split("/").pop() ?? crypto.randomUUID();
  URL.revokeObjectURL(url);
  return id;
};
dynamicDefaults.DEFAULTS.uuid = () => uid;
const ajv = new AJV({
  code: { esm: true },
  coerceTypes: true,
  keywords: [dynamicDefaults()],
  removeAdditional: true,
  schemas: [Credentials, Data, Page, Importmap, Feed],
  useDefaults: true,
});
addFormats(ajv);
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
  consoleError = (error: unknown) => {
    window.console.error(error);
  },
  customFetch = async (url: string) => (await fetch(url)).text(),
  feed = reactive({} as TFeed),
  getFontsObjectFromArray = (fonts: string[]) =>
    Object.fromEntries(
      fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
    ),
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
      return ["", undefined].includes(this.header)
        ? (this.name ?? "")
        : this.header;
    },
  },
  to = {
    get(this: TPage) {
      return this.path?.replace(/^\/?/, "/").replace(/\/?$/, "/");
    },
  },
  validateCredentials = ajv.getSchema("urn:jsonschema:credentials"),
  validateData = ajv.getSchema("urn:jsonschema:data"),
  validateFeed = ajv.getSchema("urn:jsonschema:feed"),
  validateImportmap = ajv.getSchema("urn:jsonschema:importmap"),
  {
    add,
    down,
    leaves: pages,
    left,
    objLeaves: atlas,
    remove,
    right,
    up,
  } = useFlatJsonTree(nodes) as unknown as IFlatJsonTree;
watch(feed, async (value) => {
  await validateFeed?.(value);
});
watch(importmap, async (value) => {
  await validateImportmap?.(value);
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
export type { TCredentials, TFeed, TImportmap, TPage };
export {
  add,
  atlas,
  consoleError,
  customFetch,
  down,
  feed,
  getFontsObjectFromArray,
  importmap,
  left,
  nodes,
  pages,
  remove,
  right,
  uid,
  up,
  validateCredentials,
};
