import { test, expect } from '@playwright/test';

test.describe('Personalized Content Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load dashboard layout with header, sticky sidebar, and content cards', async ({ page }) => {
    // Check brand title
    await expect(page.locator('text=PulseHub').first()).toBeVisible();

    // Check main navigation links
    await expect(page.locator('text=Personalized Feed')).toBeVisible();
    await expect(page.locator('text=Favorites')).toBeVisible();
    await expect(page.locator('text=Preferences & Settings')).toBeVisible();

    // Check search input exists
    const searchInput = page.getByRole('searchbox', { name: /search dashboard content/i });
    await expect(searchInput).toBeVisible();

    // Check that real content cards are rendered
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should perform debounced search filtering across feeds', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /search dashboard content/i });

    // Type search query
    await searchInput.fill('Spider');

    // Wait for debounced search to update UI
    await page.waitForTimeout(1000);

    // Verify cards are displayed matching search
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    // Clear search
    const clearButton = page.getByRole('button', { name: /clear search query/i });
    await clearButton.click();
    await page.waitForTimeout(1000);

    // Verify items return
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should add card to favorites and display under /favorites page', async ({ page }) => {
    // Find the first content card's favorite button
    const firstCard = page.locator('article').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    const favButton = firstCard.getByRole('button', { name: /add to favorites/i });
    await favButton.click();

    // Navigate to favorites page
    await page.click('text=Favorites');
    await expect(page).toHaveURL(/.*favorites/);

    // Verify favorites page shows bookmarked card
    await expect(page.locator('h2:has-text("My Favorites")')).toBeVisible();
    const favoriteCards = page.locator('article');
    await expect(favoriteCards.first()).toBeVisible();

    // Remove from favorites
    const removeFavButton = favoriteCards.first().getByRole('button', { name: /remove from favorites/i });
    await removeFavButton.click();

    // Verify empty state is displayed
    await expect(page.locator('text=No favorites saved yet')).toBeVisible();
  });

  test('should navigate to Settings and allow customizing preferences', async ({ page }) => {
    await page.getByRole('link', { name: /Preferences & Settings/i }).click();
    await expect(page).toHaveURL(/.*settings/);

    await expect(page.locator('h2:has-text("Dashboard Preferences")')).toBeVisible();

    // Verify topics section
    await expect(page.locator('text=Preferred Topic Categories')).toBeVisible();
    await expect(page.locator('text=Auto-Refresh Frequency')).toBeVisible();

    // Toggle sports topic
    const sportsBtn = page.getByRole('button', { name: /sports/i });
    await sportsBtn.click();

    // Toggle theme to light mode
    const lightModeBtn = page.getByRole('button', { name: /Light Mode Clean/i });
    await lightModeBtn.click();

    // Ensure html element has or has not dark class
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });
});
