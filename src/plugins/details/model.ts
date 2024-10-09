import {
  TableInitEffect,
  TableInitOptions,
  TablePluginModel,
} from '@jotai-table';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { atomEffect, withAtomEffect } from 'jotai-effect';

export class DetailsPluginModel<Data> extends TablePluginModel<Data> {
  private readonly $isAllCollapsed;

  private readonly detailsFamily;

  constructor(initOptions: TableInitOptions<Data>) {
    super(initOptions);

    this.$isAllCollapsed = atom(true);

    this.detailsFamily = atomFamily((id: string) => {
      const $isCollapsed = atom(true);
      $isCollapsed.debugLabel = `details.${id}`;

      return withAtomEffect($isCollapsed, (get, set) => {
        const isAllCollapsed = get(this.$isAllCollapsed);

        set($isCollapsed, isAllCollapsed);
      });
    });
  }

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

  uncollapse() {
    return atom(null, (_, set) => {
      set(this.$isAllCollapsed, false);
    });
  }

  init(): TableInitEffect {
    return atomEffect(() => {});
  }
}
