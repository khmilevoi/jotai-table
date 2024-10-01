import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { atomEffect, withAtomEffect } from "jotai-effect";
import type { InitEffect, PluginModel } from "jotai-table";

export class DetailsPluginModel<Data> implements PluginModel<Data> {
  private readonly $isAllCollapsed = atom(true);

  private readonly detailsFamily = atomFamily((id: string) => {
    const $isCollapsed = atom(true);
    $isCollapsed.debugLabel = `details.${id}`;

    return withAtomEffect($isCollapsed, (get, set) => {
      const isAllCollapsed = get(this.$isAllCollapsed);

      set($isCollapsed, isAllCollapsed);
    });
  });

  getIsAllCollapsed() {
    return this.$isAllCollapsed;
  }

  getStatus(id: string) {
    return this.detailsFamily(id);
  }

  collapse() {
    return atom(null, (_, set) => {
      set(this.$isAllCollapsed, true);
    });
  }

  show() {
    return atom(null, (_, set) => {
      set(this.$isAllCollapsed, false);
    });
  }

  init(): InitEffect {
    return atomEffect(() => {});
  }
}
