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

import Credentials from "@/schemas/credentials";
import Feed from "@/schemas/feed";
import Fonts from "@/schemas/fonts";
import Importmap from "@/schemas/importmap";
import Log from "@/schemas/log";
import Nodes from "@/schemas/nodes";
import Page from "@/schemas/page";

export type TCredentials = FromSchema<typeof Credentials>;
export type TFeed = FromSchema<typeof Feed>;
export type TFonts = FromSchema<typeof Fonts>;
export type TImportmap = FromSchema<typeof Importmap>;
export type TLog = FromSchema<typeof Log>;
export type TPage = FromSchema<typeof Page> & {
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

const schemas = [Credentials, Nodes, Page, Importmap, Feed, Fonts, Log],
  ajv = new AJV({
    code: { esm: true },
    coerceTypes: true,
    keywords: [dynamicDefaults()],
    removeAdditional: true,
    schemas,
    useDefaults: true,
  }),
  data = {
    credentials: reactive({} as TCredentials),
    feed: reactive({} as TFeed),
    fonts: reactive([] as TFonts),
    importmap: reactive({} as TImportmap),
    log: reactive({} as TLog),
  },
  immediate = true,
  properties = {
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
  validate: Record<string, AnyValidateFunction | undefined> =
    Object.fromEntries(schemas.map(({ $id }) => [$id, ajv.getSchema($id)]));

/**
 * Fetches text content from a URL
 *
 * @param input - The URL to fetch content from
 * @returns The fetched content or undefined if an error occurs
 */
export const fetching = async (input: string) => {
    try {
      return await ofetch(input);
    } catch (error) {
      consola.error(error);
    }
  },
  tree = reactive([] as TPage[]),
  { add, addChild, down, kvNodes, left, nodes, remove, right, up } =
    useFlatJsonTree(tree) as ReturnType<typeof useFlatJsonTree> & {
      kvNodes: ComputedRef<Record<string, TPage>>;
      nodes: ComputedRef<TPage[]>;
    },
  { credentials, feed, fonts, importmap, log } = data;

Object.keys(data).forEach((key) => {
  if (validate[key])
    watch(data[key as keyof object], validate[key], { immediate });
});

watch(
  nodes,
  async (value) => {
    if (!(await validate["data"]?.(value))) {
      tree.length = 0;
      tree.push({} as TPage);
    } else
      value.forEach((element) => {
        if (Object.keys(properties).some((key) => !(key in element)))
          Object.defineProperties(element, properties);
      });
  },
  { immediate },
);
