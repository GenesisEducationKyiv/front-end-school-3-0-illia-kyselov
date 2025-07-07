import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 2560, height: 1440 } });
test.setTimeout(60 * 1000);

test('create, edit, search, select, delete and verify removal', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const trackTitle = `Test Track ${uniqueId}`;
    const artistName = 'Test Artist';
    const albumName = 'Test Album';
    const coverUrl = 'https://example.com/cover.jpg';

    await page.goto('http://localhost:3000/tracks/');
    await page.waitForSelector('[data-testid="create-track-button"]');
    await page.click('[data-testid="create-track-button"]');

    await page.waitForSelector('[data-testid="input-title"]');
    await page.fill('[data-testid="input-title"]', trackTitle);
    await page.fill('[data-testid="input-artist"]', artistName);
    await page.fill('[data-testid="input-album"]', albumName);
    await page.fill('[data-testid="input-cover-image"]', coverUrl);

    const genreButton = page.locator('[data-testid="track-form"] button:not([data-testid])').first();
    await genreButton.click();

    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector(`text=${trackTitle}`);

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill(trackTitle);
    await page.waitForSelector(`text=${trackTitle}`);

    await searchInput.fill('');

    const card = page.locator('[data-testid^="track-item-"]', { hasText: trackTitle });
    await card.locator('[data-testid^="edit-track-"]').click();
    await page.waitForSelector('[data-testid="input-title"]');

    const newTrackTitle = `Updated Track ${uniqueId}`;
    await page.fill('[data-testid="input-title"]', newTrackTitle);
    await page.fill('[data-testid="input-artist"]', 'Updated Artist');
    await page.fill('[data-testid="input-album"]', 'Updated Album');
    await page.fill('[data-testid="input-cover-image"]', 'https://example.com/new-cover.jpg');

    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector(`text=${newTrackTitle}`);

    const updatedCard = page.locator('[data-testid^="track-item-"]', { hasText: newTrackTitle });
    const checkboxInput = updatedCard.locator('input[data-testid^="track-checkbox-"]');
    const checkboxLabel = checkboxInput.locator('xpath=..');
    await checkboxLabel.click();
    await expect(checkboxInput).toBeChecked();

    await page.click('[data-testid="bulk-delete-button"]');
    await page.waitForSelector('text=Are you sure you want to delete this track?');
    await page.click('[data-testid="confirm-delete"]');

    await expect(page.locator(`text=${newTrackTitle}`)).toHaveCount(0);
});
