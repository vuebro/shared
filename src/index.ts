import type { TImportmap, TPage } from "@vues3/types";
import type { ComputedRef, Reactive } from "vue";

import useFlatJsonTree from "@vues3/flat-json-tree";
import { validateData } from "@vues3/types";
import { reactive, watch } from "vue";

export const deep = true;
export const importmap = reactive({} as TImportmap);
export const data: Reactive<TPage[]> = reactive([]);
export const customFetch = async (url: string) => (await fetch(url)).text();
const flatJsonTree = useFlatJsonTree(data);
export const { add, down, left, remove, right, up } = flatJsonTree;
export const { leaves: pages } = flatJsonTree as unknown as {
  leaves: ComputedRef<TPage[]>;
};
const $children = {
  get(this: TPage) {
    return this.children?.filter(({ enabled }) => enabled);
  },
};
const $siblings = {
  get(this: TPage) {
    return this.siblings.filter(({ enabled }) => enabled);
  },
};
const $index = {
  get(this: TPage) {
    return this.$siblings.findIndex(({ id }) => this.id === id);
  },
};
const $prev = {
  get(this: TPage) {
    return this.$siblings[this.$index - 1];
  },
};
const $next = {
  get(this: TPage) {
    return this.$siblings[this.$index + 1];
  },
};
const path = {
  get(this: TPage) {
    return this.branch
      .slice(1)
      .map(({ name }) => name ?? "-")
      .join("/")
      .replaceAll(" ", "_");
  },
};
const to = {
  get(this: TPage) {
    return (this.loc?.replaceAll(" ", "_") ?? this.path)
      .replace(/^\/?/, "/")
      .replace(/\/?$/, "/");
  },
};
const i = {
  get(this: TPage) {
    return this.icon && `i-${this.icon}`;
  },
};
const title = {
  get(this: TPage) {
    return this.header ?? this.name;
  },
};
watch(data, (value) => {
  validateData(value);
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
export const getFonts = (fonts: string[]) =>
  Object.fromEntries(
    fonts.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
  );
