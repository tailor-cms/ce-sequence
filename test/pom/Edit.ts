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

  // The base `focus()` clicks the centre of the edit frame, but for a sequence
  // that lands on an entry's title field, which stops click propagation (so
  // typing doesn't toggle the panel) and therefore never focuses the element.
  // Click the frame's left padding strip instead, which bubbles to the frame's
  // focus handler and reveals the side toolbar.
  async focus(): Promise<void> {
    await this.editor.click({ position: { x: 5, y: 5 } });
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

  modeBtn(name: 'Steps' | 'Timeline'): Locator {
    return this.sideToolbar.getByRole('button', { name, exact: true });
  }

  markerInput(index: number): Locator {
    return this.entryHeader(index).getByPlaceholder('Date');
  }

  titleInput(index: number): Locator {
    return this.entryHeader(index).getByPlaceholder('Title');
  }
}
