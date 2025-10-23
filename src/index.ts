import type { AnyValidateFunction } from "ajv/dist/core";
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

/* -------------------------------------------------------------------------- */
/*                              Объявления типов                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                            Значения по умолчанию                           */
/* -------------------------------------------------------------------------- */

const immediate = true;

/* -------------------------------------------------------------------------- */
/*                              Служебные функции                             */
/* -------------------------------------------------------------------------- */

const getFontsObjectFromArray = (fonts: TFonts) =>
    Object.fromEntries(
      fonts.map((value) => [value.toLowerCase().replace(/ /g, "_"), value]),
    ),
  uid = () => {
    const url = URL.createObjectURL(new Blob()),
      id = url.split("/").pop() ?? crypto.randomUUID();
    URL.revokeObjectURL(url);
    return id;
  };

/* -------------------------------------------------------------------------- */
/*                               Проверки типов                               */
/* -------------------------------------------------------------------------- */

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
  validate: Record<string, AnyValidateFunction> = Object.fromEntries(
    schemas.map(({ $id }) => [$id.split(":").pop(), ajv.getSchema($id)]),
  ),
  validateCredentials = validate["credentials"],
  validateLog = validate["log"];

/* -------------------------------------------------------------------------- */
/*                Дополнительные расчетные аттрибуты для дерева               */
/* -------------------------------------------------------------------------- */

const properties: PropertyDescriptorMap = {
  $children: {
    get(this: TPage) {
      return this.children.filter(({ enabled }) => enabled);
    },
  },
  $index: {
    get(this: TPage) {
      return this.$siblings.findIndex(({ id }) => this.id === id);
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
  $siblings: {
    get(this: TPage) {
      return this.siblings.filter(({ enabled }) => enabled);
    },
  },
  i: {
    get(this: TPage) {
      return this.icon && `i-${this.icon}`;
    },
  },
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
      return ["", undefined].includes(this.header)
        ? (this.name ?? "")
        : this.header;
    },
  },
  to: {
    get(this: TPage) {
      return this.path?.replace(/^\/?/, "/").replace(/\/?$/, "/");
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                              Основные реактивы                             */
/* -------------------------------------------------------------------------- */

const feed = reactive({} as TFeed),
  fonts = reactive([] as TFonts),
  importmap = reactive({} as TImportmap),
  nodes = reactive([] as TPage[]);

/* -------------------------------------------------------------------------- */
/*                    Получение аттрибутов плоского дерева                    */
/* -------------------------------------------------------------------------- */

const {
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

export type { TCredentials, TFeed, TFonts, TImportmap, TLog, TPage };

export {
  add,
  addChild,
  atlas,
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
