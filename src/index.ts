import type { AnyValidateFunction } from "ajv/dist/core";
import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import useFlatJsonTree from "@vuebro/flat-json-tree";
import AJV from "ajv";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults.js";
import { consola } from "consola/browser";
import { ofetch } from "ofetch";
import uid from "uuid-random";
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
  id: string;
  index: number;
  next?: TPage;
  parent?: TPage;
  path?: string;
  prev?: TPage;
  siblings: TPage[];
  title?: string;
  to?: string;
};

/**
 * Generates a UUID
 *
 * @returns A generated UUID
 */
dynamicDefaults.DEFAULTS["uuid"] = () => uid;

const schemas = [Credentials, Data, Page, Importmap, Feed, Fonts, Log],
  ajv = new AJV({
    code: { esm: true },
    coerceTypes: true,
    keywords: [dynamicDefaults()],
    removeAdditional: true,
    schemas,
    useDefaults: true,
  }),
  feed = reactive({} as TFeed),
  /**
   * Fetches text content from a URL
   *
   * @param input - The URL to fetch content from
   * @returns The fetched content or undefined if an error occurs
   */
  fetching = async (input: string) => {
    try {
      return await ofetch(input);
    } catch (error) {
      consola.error(error);
    }
  },
  fonts = reactive([] as TFonts),
  immediate = true,
  importmap = reactive({} as TImportmap),
  nodes = reactive([] as TPage[]),
  properties: PropertyDescriptorMap = {
    $children: {
      /**
       * Returns enabled child nodes
       *
       * @returns The enabled child nodes
       */
      get(this: TPage) {
        return this.children.filter(({ enabled }) => enabled);
      },
    },
    $index: {
      /**
       * Returns index among siblings
       *
       * @returns The index of this node among its siblings
       */
      get(this: TPage) {
        return this.$siblings.findIndex(({ id }) => this.id === id);
      },
    },
    $next: {
      /**
       * Returns next sibling among enabled nodes
       *
       * @returns The next sibling node or undefined if none exists
       */
      get(this: TPage) {
        return this.$siblings[this.$index + 1];
      },
    },
    $prev: {
      /**
       * Returns previous sibling among enabled nodes
       *
       * @returns The previous sibling node or undefined if none exists
       */
      get(this: TPage) {
        return this.$siblings[this.$index - 1];
      },
    },
    $siblings: {
      /**
       * Returns all enabled siblings
       *
       * @returns The enabled sibling nodes
       */
      get(this: TPage) {
        return this.siblings.filter(({ enabled }) => enabled);
      },
    },
    i: {
      /**
       * Returns icon class name
       *
       * @returns The icon class name or undefined if no icon is set
       */
      get(this: TPage) {
        return this.icon && `i-${this.icon}`;
      },
    },
    path: {
      /**
       * Returns URL path based on branch
       *
       * @returns The path or undefined if any branch segment has no name
       */
      get(this: TPage) {
        const branch = this.branch.slice(1);
        return branch.some(({ name }) => !name)
          ? undefined
          : branch
              .map(({ name }) => name)
              .join("/")
              .replace(/ /g, "_");
      },
    },
    title: {
      /**
       * Returns page title (header or name)
       *
       * @returns The page title
       */
      get(this: TPage) {
        return ["", undefined].includes(this.header)
          ? (this.name ?? "")
          : this.header;
      },
    },
    to: {
      /**
       * Returns full URL path
       *
       * @returns The full URL path or undefined if path is not defined
       */
      get(this: TPage) {
        return this.path?.replace(/^\/?/, "/").replace(/\/?$/, "/");
      },
    },
  },
  validate: Record<string, AnyValidateFunction> = Object.fromEntries(
    schemas.map(({ $id }) => [$id.split(":").pop(), ajv.getSchema($id)]),
  ),
  validateCredentials = validate["credentials"],
  validateLog = validate["log"],
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
  } = useFlatJsonTree(nodes) as IFlatJsonTree;

watch(
  feed,
  async (value) => {
    await validate["feed"]?.(value);
  },
  { immediate },
);

watch(
  fonts,
  async (value) => {
    await validate["fonts"]?.(value);
  },
  { immediate },
);

watch(
  importmap,
  async (value) => {
    await validate["importmap"]?.(value);
  },
  { immediate },
);

watch(
  pages,
  async (value) => {
    if (!(await validate["data"]?.(value))) {
      nodes.length = 0;
      nodes.push({} as TPage);
    } else
      value.forEach((element) => {
        if (Object.keys(properties).some((key) => !(key in element)))
          Object.defineProperties(element, properties);
      });
  },
  { immediate },
);

export type { TCredentials, TFeed, TFonts, TImportmap, TLog, TPage };

export {
  add,
  addChild,
  atlas,
  down,
  feed,
  fetching,
  fonts,
  importmap,
  left,
  nodes,
  pages,
  remove,
  right,
  up,
  validateCredentials,
  validateLog,
};
