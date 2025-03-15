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
dynamicDefaults.DEFAULTS.uuid = () => () => v4();
const ajv = new AJV({
    code: { esm: true },
    coerceTypes: true,
    keywords: [dynamicDefaults()],
    removeAdditional: true,
    schemas: [Credentials, Data, Page, Importmap],
    useDefaults: true,
  }),
  consoleError = (error: unknown) => {
    window.console.error(error);
  },
  customFetch = async (url: string) => (await fetch(url)).text(),
  getFontsObjectFromArray = (fonts: string[]) =>
    Object.fromEntries(
      fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
    ),
  importmap = reactive({} as TImportmap),
  nodes = reactive([] as TPage[]),
  validateCredentials = ajv.getSchema("urn:jsonschema:credentials"),
  validateData = ajv.getSchema("urn:jsonschema:data"),
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
        $children: {
          get: () => element.children.filter(({ enabled }) => enabled),
        },
        $index: {
          get: () => element.$siblings.findIndex(({ id }) => element.id === id),
        },
        $next: {
          get: () => element.$siblings[element.$index + 1],
        },
        $prev: {
          get: () => element.$siblings[element.$index - 1],
        },
        $siblings: {
          get: () => element.siblings.filter(({ enabled }) => enabled),
        },
        i: {
          get: () => element.icon && `i-${element.icon}`,
        },
        path: {
          get: () => {
            const branch = element.branch.slice(1);
            return branch.some(({ name }) => !name)
              ? undefined
              : branch
                  .map(({ name }) => name)
                  .join("/")
                  .replaceAll(" ", "_");
          },
        },
        title: {
          get: () =>
            ["", undefined].includes(element.header)
              ? element.name
              : element.header,
        },
        to: {
          get: () =>
            (element.loc?.replaceAll(" ", "_") ?? element.path)
              ?.replace(/^\/?/, "/")
              .replace(/\/?$/, "/"),
        },
      });
    });
});
export type { TCredentials, TImportmap, TPage };
export {
  add,
  atlas,
  consoleError,
  customFetch,
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
