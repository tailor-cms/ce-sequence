import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly root: Locator;
  readonly track: Locator;
  readonly items: Locator;
  readonly indices: Locator;
  readonly markers: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-sequence-root');
    this.track = this.root.locator('.v-timeline');
    this.items = this.track.locator('.v-timeline-item');
    this.indices = this.track.locator('.sequence-item-index');
    this.markers = this.track.locator('.sequence-item-marker');
  }
}
