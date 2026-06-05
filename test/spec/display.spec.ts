import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-sequence-display';

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

// The runtime's EmbeddedContainer renders `embed.data.content` verbatim.
const embed = (id: string, content: string) => ({
  id,
  data: { content },
  embedded: true,
  position: 1,
  type: 'TIPTAP_HTML',
});

test.describe('Content', () => {
  test('Renders title and content per entry', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      numbered: true,
      embeds: { e1: embed('e1', 'First content') },
      items: {
        a: {
          id: 'a',
          title: 'First step',
          body: { e1: true },
          position: 1,
        },
      },
    });
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.items.nth(0)).toContainText('First step');
    await expect(display.items.nth(0)).toContainText('First content');
  });
});
