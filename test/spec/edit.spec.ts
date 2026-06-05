import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-sequence-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Renders 2 entries by default', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.entries).toHaveCount(2);
    await expect(edit.addEntryBtn).toBeVisible();
  });
});

test.describe('Entry management', () => {
  test('Adds a new entry', async ({ page }) => {
    const edit = new Edit(page);
    await edit.addEntryBtn.click();
    await expect(edit.entries).toHaveCount(3);
  });

  test('Deletes an entry', async ({ page }) => {
    const edit = new Edit(page);
    await edit.entryHeader(0).hover();
    await edit.deleteBtn(0).click();
    await edit.confirmationDialog
      .getByRole('button', { name: 'Confirm' })
      .click();
    await expect(edit.entries).toHaveCount(1);
  });
});

test.describe('Readonly mode', () => {
  test('Hides add/delete controls', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.addEntryBtn).not.toBeVisible();
    await edit.entryHeader(0).hover();
    await expect(edit.deleteBtn(0)).not.toBeVisible();
  });
});
