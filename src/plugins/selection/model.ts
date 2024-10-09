import {
  TableInitEffect,
  TableInitOptions,
  TablePluginModel,
} from '@jotai-table';
import type { Atom } from 'jotai';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

import { SelectionModelOptions } from './types';

export class SelectionPluginModel<Data> extends TablePluginModel<Data> {
  private readonly $isSelected: Atom<boolean>;
  private readonly $activeItemsSet;

  constructor(
    private readonly pluginOptions: SelectionModelOptions<Data>,
    options: TableInitOptions<Data>,
  ) {
    super(options);

    this.$isSelected = atom(
      (get) => get(pluginOptions.$activeItems).length > 0,
    );
    this.$activeItemsSet = atom(new Set<string>());
  }

  getStatus() {
    return this.pluginOptions.$status;
  }

  getIsSelected() {
    return this.$isSelected;
  }

  setStatus() {
    return atom(null, (_, set, nextStatus: boolean) => {
      set(this.pluginOptions.$status, nextStatus ? 'active' : 'inactive');
    });
  }

  getIsActive(data: Data) {
    return this.pluginOptions.getIsActive(data);
  }

  getActiveItems() {
    return this.pluginOptions.$activeItems;
  }

  init(): TableInitEffect {
    const mainEffect = this.createMainEffect();
    const activeItemsEffect = this.createActiveItemsEffect();
    const statusEffect = this.createStatusEffect();
    const updateStatusEffect = this.createUpdateStatusEffect();

    return atomEffect((get) => {
      get(mainEffect);
      get(statusEffect);
      get(activeItemsEffect);
      get(updateStatusEffect);
    });
  }

  private createMainEffect() {
    return atomEffect((get, set) => {
      const rows = get(this.$rows);

      rows.forEach((row) => {
        const $isActive = this.pluginOptions.getIsActive(row.data);

        get(
          atomEffect((get, set) => {
            const isActive = get($isActive);

            const activeItemsSet = get.peek(this.$activeItemsSet);

            if (isActive) {
              activeItemsSet.add(row.id);
            } else {
              activeItemsSet.delete(row.id);
            }

            set(this.$activeItemsSet, new Set(activeItemsSet));
          }),
        );
      });

      return () => {
        const nextRows = get(this.$rows);
        const activeItems = get.peek(this.$activeItemsSet);

        const oldIds = new Set(activeItems.keys());

        nextRows.forEach((row) => {
          oldIds.delete(row.id);
        });

        oldIds.forEach((expiredKey) => {
          activeItems.delete(expiredKey);
        });

        set(this.$activeItemsSet, new Set(activeItems));
      };
    });
  }

  private createActiveItemsEffect() {
    return atomEffect((get, set) => {
      const activeItemsSet = get(this.$activeItemsSet);
      const dataMap = get.peek(this.$dataMap);

      set(
        this.pluginOptions.$activeItems,
        [...activeItemsSet].map((id) => dataMap.get(id)!),
      );
    });
  }

  private createStatusEffect() {
    return atomEffect((get, set) => {
      const activeItemsSet = get(this.$activeItemsSet);
      const rows = get.peek(this.$rows);

      if (rows.length === activeItemsSet.size) {
        set(this.pluginOptions.$status, 'active');
      } else if (activeItemsSet.size === 0) {
        set(this.pluginOptions.$status, 'inactive');
      } else {
        set(this.pluginOptions.$status, 'partial');
      }
    });
  }

  private createUpdateStatusEffect() {
    return atomEffect((get, set) => {
      const status = get(this.pluginOptions.$status);
      const rows = get.peek(this.$rows);

      if (status === 'partial') {
        return;
      }

      rows.forEach((row) =>
        set(this.pluginOptions.getIsActive(row.data), status === 'active'),
      );
    });
  }
}
