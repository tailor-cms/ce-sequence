import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly root: Locator;
  readonly entries: Locator;
  readonly addEntryBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.v-expansion-panels');
    this.entries = this.root.locator('.v-expansion-panel');
    this.addEntryBtn = this.editor.getByRole('button', { name: 'Add Entry' });
  }

  entryAt(index: number): Locator {
    return this.entries.nth(index);
  }

  entryHeader(index: number): Locator {
    return this.entryAt(index).locator('.v-expansion-panel-title');
  }

  deleteBtn(index: number): Locator {
    return this.entryHeader(index).getByRole('button', {
      name: 'Delete entry',
      exact: true,
    });
  }
}
