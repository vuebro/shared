import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import useFlatJsonTree from "@vuebro/flat-json-tree";
import AJV from "ajv";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults.js";
import { reactive, watch } from "vue";

import Credentials from "./types/credentials";
import Data from "./types/data";
import Feed from "./types/feed";
import Fonts from "./types/fonts";
import Importmap from "./types/importmap";
import Log from "./types/log";
import Page from "./types/page";

interface IFlatJsonTree {
  add: (pId: string) => string | undefined;
  addChild: (pId: string) => string | undefined;
  down: (pId: string) => void;
  left: (pId: string) => string | undefined;
  nodes: ComputedRef<TPage[]>;
  nodesMap: ComputedRef<Record<string, TPage>>;
  remove: (pId: string) => string | undefined;
  right: (pId: string) => string | undefined;
  up: (pId: string) => void;
}
type TCredentials = FromSchema<typeof Credentials>;
type TFeed = FromSchema<typeof Feed>;
type TFonts = FromSchema<typeof Fonts>;
type TImportmap = FromSchema<typeof Importmap>;
type TLog = FromSchema<typeof Log>;
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

const immediate = true,
  uid = () => {
    const url = URL.createObjectURL(new Blob()),
      id = url.split("/").pop() ?? crypto.randomUUID();
    URL.revokeObjectURL(url);
    return id;
  };
dynamicDefaults.DEFAULTS.uuid = () => uid;
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
  ajv = new AJV({
    code: { esm: true },
    coerceTypes: true,
    keywords: [dynamicDefaults()],
    removeAdditional: true,
    schemas: [Credentials, Data, Page, Importmap, Feed, Fonts, Log],
    useDefaults: true,
  }),
  customFetch = async (url: string) => (await fetch(url)).text(),
  feed = reactive({} as TFeed),
  fonts = reactive([] as TFonts),
  getFontsObjectFromArray = (fonts: TFonts) =>
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
  validateFonts = ajv.getSchema("urn:jsonschema:fonts"),
  validateImportmap = ajv.getSchema("urn:jsonschema:importmap"),
  validateLog = ajv.getSchema("urn:jsonschema:log"),
  {
    add,
    addChild,
    down,
    left,
    nodes: pages,
    nodesMap: atlas,
    remove,
    right,
    up,
  } = useFlatJsonTree(nodes) as unknown as IFlatJsonTree;

watch(
  feed,
  async (value) => {
    await validateFeed?.(value);
  },
  { immediate },
);
watch(
  fonts,
  async (value) => {
    await validateFonts?.(value);
  },
  { immediate },
);
watch(
  importmap,
  async (value) => {
    await validateImportmap?.(value);
  },
  { immediate },
);

watch(
  pages,
  async (value) => {
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
  },
  { immediate },
);

export type { TCredentials, TFeed, TFonts, TImportmap, TLog, TPage };
export {
  add,
  addChild,
  atlas,
  customFetch,
  down,
  feed,
  fonts,
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
  validateLog,
};
