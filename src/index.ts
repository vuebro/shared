import type { AnyValidateFunction } from "ajv/dist/core";
import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults.js";
import useFlatJsonTree from "@vuebro/flat-json-tree";
import { consola } from "consola/browser";
import { reactive, watch } from "vue";
import AJV from "ajv";

import Credentials from "./types/credentials";
import Importmap from "./types/importmap";
import Fonts from "./types/fonts";
import Data from "./types/data";
import Feed from "./types/feed";
import Page from "./types/page";
import Log from "./types/log";

/* -------------------------------------------------------------------------- */
/*                              Объявления типов                              */
/* -------------------------------------------------------------------------- */

interface IFlatJsonTree {
  addChild: (pId: string) => undefined | string;
  nodesMap: ComputedRef<Record<string, TPage>>;
  remove: (pId: string) => undefined | string;
  right: (pId: string) => undefined | string;
  left: (pId: string) => undefined | string;
  add: (pId: string) => undefined | string;
  down: (pId: string) => void;
  nodes: ComputedRef<TPage[]>;
  up: (pId: string) => void;
}
type TPage = {
  $children: TPage[];
  $siblings: TPage[];
  children: TPage[];
  siblings: TPage[];
  branch: TPage[];
  $index: number;
  parent?: TPage;
  title?: string;
  $next?: TPage;
  $prev?: TPage;
  index: number;
  path?: string;
  next?: TPage;
  prev?: TPage;
  to?: string;
  i?: string;
} & FromSchema<typeof Page>;
type TCredentials = FromSchema<typeof Credentials>;
type TImportmap = FromSchema<typeof Importmap>;
type TFonts = FromSchema<typeof Fonts>;
type TFeed = FromSchema<typeof Feed>;
type TLog = FromSchema<typeof Log>;

/* -------------------------------------------------------------------------- */
/*                            Значения по умолчанию                           */
/* -------------------------------------------------------------------------- */

const immediate = true;

/* -------------------------------------------------------------------------- */
/*                              Служебные функции                             */
/* -------------------------------------------------------------------------- */

const fetchText = async (input: string, text = "") => {
    try {
      const response = await fetch(input);
      if (response.ok) return await response.text();
      else throw new Error(`Response status: ${response.status.toString()}`);
    } catch (error) {
      consola.error(error);
      return text;
    }
  },
  uid = () => {
    const url = URL.createObjectURL(new Blob()),
      id = url.split("/").pop() ?? crypto.randomUUID();
    URL.revokeObjectURL(url);
    return id;
  },
  getFontsObjectFromArray = (fonts: TFonts) =>
    Object.fromEntries(
      fonts.map((value) => [value.toLowerCase().replace(/ /g, "_"), value]),
    );

/* -------------------------------------------------------------------------- */
/*                               Проверки типов                               */
/* -------------------------------------------------------------------------- */

dynamicDefaults.DEFAULTS["uuid"] = () => uid;
const schemas = [Credentials, Data, Page, Importmap, Feed, Fonts, Log],
  ajv = new AJV({
    keywords: [dynamicDefaults()],
    removeAdditional: true,
    code: { esm: true },
    coerceTypes: true,
    useDefaults: true,
    schemas,
  }),
  validate: Record<string, AnyValidateFunction> = Object.fromEntries(
    schemas.map(({ $id }) => [$id.split(":").pop(), ajv.getSchema($id)]),
  ),
  validateCredentials = validate["credentials"],
  validateLog = validate["log"];

/* -------------------------------------------------------------------------- */
/*                Дополнительные расчетные аттрибуты для дерева               */
/* -------------------------------------------------------------------------- */

const properties: PropertyDescriptorMap = {
  path: {
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
    get(this: TPage) {
      return [undefined, ""].includes(this.header)
        ? (this.name ?? "")
        : this.header;
    },
  },
  $index: {
    get(this: TPage) {
      return this.$siblings.findIndex(({ id }) => this.id === id);
    },
  },
  $children: {
    get(this: TPage) {
      return this.children.filter(({ enabled }) => enabled);
    },
  },
  $siblings: {
    get(this: TPage) {
      return this.siblings.filter(({ enabled }) => enabled);
    },
  },
  to: {
    get(this: TPage) {
      return this.path?.replace(/^\/?/, "/").replace(/\/?$/, "/");
    },
  },
  $next: {
    get(this: TPage) {
      return this.$siblings[this.$index + 1];
    },
  },
  $prev: {
    get(this: TPage) {
      return this.$siblings[this.$index - 1];
    },
  },
  i: {
    get(this: TPage) {
      return this.icon && `i-${this.icon}`;
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                              Основные реактивы                             */
/* -------------------------------------------------------------------------- */

const importmap = reactive({} as TImportmap),
  nodes = reactive([] as TPage[]),
  fonts = reactive([] as TFonts),
  feed = reactive({} as TFeed);

/* -------------------------------------------------------------------------- */
/*                    Получение аттрибутов плоского дерева                    */
/* -------------------------------------------------------------------------- */

const {
  nodesMap: atlas,
  nodes: pages,
  addChild,
  remove,
  right,
  down,
  left,
  add,
  up,
} = useFlatJsonTree(nodes) as IFlatJsonTree;

/* -------------------------------------------------------------------------- */
/*                       Проверки консистентности данных                      */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              Экспортный раздел                             */
/* -------------------------------------------------------------------------- */

export type { TCredentials, TImportmap, TFonts, TFeed, TPage, TLog };

export {
  getFontsObjectFromArray,
  validateCredentials,
  validateLog,
  importmap,
  fetchText,
  addChild,
  remove,
  atlas,
  fonts,
  nodes,
  pages,
  right,
  down,
  feed,
  left,
  add,
  uid,
  up,
};
