import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-sequence-display';

const SEED = (mode = 'steps') => ({
  mode,
  embeds: {
    e1: {
      id: 'e1',
      data: { content: 'First content' },
      embedded: true,
      position: 1,
      type: 'TIPTAP_HTML',
    },
  },
  items: {
    a: {
      id: 'a',
      marker: '1990',
      title: 'First entry',
      body: { e1: true },
      position: 1,
    },
  },
});

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Default state', () => {
  test('Renders the sequence', async ({ page }) => {
    const display = new Display(page);
    await expect(display.track).toBeVisible();
    await expect(display.items).toHaveCount(2);
  });
});

test.describe('Steps mode', () => {
  test('Renders the position number, title and content', async ({ page }) => {
    const seed = SEED('steps');
    await elementClient.update(ELEMENT_ID, seed);
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.items.nth(0)).toContainText('First entry');
    await expect(display.items.nth(0)).toContainText('First content');
    await expect(display.indices.nth(0)).toHaveText('1');
    await expect(display.markers).toHaveCount(0);
  });
});

test.describe('Timeline mode', () => {
  test('Renders the date marker instead of a number', async ({ page }) => {
    const seed = SEED('timeline');
    await elementClient.update(ELEMENT_ID, seed);
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.items.nth(0)).toContainText('First entry');
    await expect(display.items.nth(0)).toContainText('First content');
    await expect(display.markers.nth(0)).toHaveText('1990');
    await expect(display.indices).toHaveCount(0);
  });
});
