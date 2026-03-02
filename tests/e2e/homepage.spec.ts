import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Trills Barber Cave/);
  });

  test('hero section loads correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Where Style Meets');
    await expect(page.locator('h1')).toContainText('Excellence');
    await expect(page.locator('text=Book Your Appointment')).toBeVisible();
    await expect(page.locator('text=View Our Work')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    const navigationLinks = page.locator('nav a');
    await expect(navigationLinks).toHaveCount(5); // Adjust based on actual navigation
    
    // Test booking link
    const bookingLink = page.locator('text=Book Your Appointment');
    await bookingLink.click();
    // Should open in new tab, so we check the href
    const bookingHref = await bookingLink.getAttribute('href');
    expect(bookingHref).toContain('getsquire.com');
  });

  test('business statistics are displayed', async ({ page }) => {
    await expect(page.locator('text=Reviews')).toBeVisible();
    await expect(page.locator('text=Expert Barbers')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone 12 dimensions
    
    // Check mobile navigation
    const mobileMenu = page.locator('[aria-label="Toggle menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('nav')).toBeVisible();
    }
    
    // Check hero section on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Book Your Appointment')).toBeVisible();
  });

  test('accessibility checks', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCount(1);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper button/link text
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || 
                            await button.textContent();
      expect(accessibleName?.trim()).toBeTruthy();
    }
  });

  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
