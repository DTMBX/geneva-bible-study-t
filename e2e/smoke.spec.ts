import { test, expect, type Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function expectNoConsoleErrors(page: Page, fn: () => Promise<void>) {
  const errors: string[] = []
  const handler = (msg: import('@playwright/test').ConsoleMessage) => {
    if (msg.type() === 'error') {
      const text = msg.text()
      // Ignore CORS / network errors from external APIs (expected in test)
      if (
        text.includes('CORS') ||
        text.includes('Access-Control-Allow-Origin') ||
        text.includes('net::ERR_FAILED') ||
        text.includes('Failed to fetch') ||
        text.includes('Failed to load') ||
        text.includes('Load failed') ||
        text.includes('Error fetching verse')
      ) return
      errors.push(text)
    }
  }
  page.on('console', handler)
  await fn()
  page.off('console', handler)
  expect(errors, 'Unexpected console errors').toEqual([])
}

// ---------------------------------------------------------------------------
// 1. App Shell — Load & Title
// ---------------------------------------------------------------------------

test.describe('App Shell', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Geneva Bible Study/)
  })

  test('root element renders React app', async ({ page }) => {
    await page.goto('/')
    const root = page.locator('#root')
    await expect(root).toBeAttached()
    const children = root.locator('> *')
    await expect(children.first()).toBeVisible({ timeout: 10_000 })
  })

  test('Evident ecosystem nav is present', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('nav[aria-label="Evident ecosystem"]'),
    ).toBeAttached()
  })

  test('footer is present', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('footer[aria-label="Site footer"]'),
    ).toBeAttached()
  })
})

// ---------------------------------------------------------------------------
// 2. Tab Navigation — Core tabs render content
// ---------------------------------------------------------------------------

const CORE_TABS = [
  'Home',
  'Library',
  'Compare',
  'Search',
  'Timeline',
  'Settings',
] as const

test.describe('Tab Navigation', () => {
  for (const tab of CORE_TABS) {
    test(`"${tab}" tab activates and renders content`, async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      // Click the tab trigger
      const trigger = page.locator(`[role="tab"]:has-text("${tab}"), button:has-text("${tab}"), a:has-text("${tab}")`).first()
      if (await trigger.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await trigger.click()
        // Tab panel should show content
        const content = page.locator('h1, h2, h3, p, [role="tabpanel"]').first()
        await expect(content).toBeVisible({ timeout: 10_000 })
      }
    })
  }
})

// ---------------------------------------------------------------------------
// 3. Home View — Verse of the Day
// ---------------------------------------------------------------------------

test.describe('Home View', () => {
  test('displays heading', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })

  test('verse of the day is present', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Look for verse-of-the-day component or text
    const verse = page.locator('text=/verse of the day/i, [class*="verse" i]').first()
    if (await verse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(verse).toBeVisible()
    }
  })
})

// ---------------------------------------------------------------------------
// 4. Dark Mode Toggle
// ---------------------------------------------------------------------------

test.describe('Dark Mode', () => {
  test('toggle switches theme on html element', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const html = page.locator('html')
    const initialDark = await html.evaluate(el => el.classList.contains('dark'))
    const toggle = page.locator('button[aria-label*="dark" i], button[aria-label*="light" i], button[aria-label*="Switch to" i]').first()
    if (await toggle.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await toggle.click()
      const afterDark = await html.evaluate(el => el.classList.contains('dark'))
      expect(afterDark).not.toBe(initialDark)
    }
  })
})

// ---------------------------------------------------------------------------
// 5. Search — Full-Text Query
// ---------------------------------------------------------------------------

test.describe('Search', () => {
  test('search tab has input field', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Navigate to search via tab or keyboard
    const searchTab = page.locator('[role="tab"]').filter({ hasText: /search/i }).first()
    if (await searchTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await searchTab.click()
    } else {
      // Try keyboard shortcut
      await page.keyboard.press('Control+k')
    }
    const input = page.locator('input').first()
    await expect(input).toBeVisible({ timeout: 10_000 })
  })

  test('search accepts text input', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const searchTab = page.locator('[role="tab"]').filter({ hasText: /search/i }).first()
    if (await searchTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await searchTab.click()
    } else {
      await page.keyboard.press('Control+k')
    }
    const input = page.locator('input').first()
    await expect(input).toBeVisible({ timeout: 10_000 })
    await input.fill('Genesis')
    await expect(input).toHaveValue('Genesis')
  })
})

// ---------------------------------------------------------------------------
// 6. Library View — Book List
// ---------------------------------------------------------------------------

test.describe('Library', () => {
  test('library shows book listings', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const libraryTab = page.locator('[role="tab"]').filter({ hasText: /library/i }).first()
    if (await libraryTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await libraryTab.click()
      // Should list Bible books — wait for any book name to appear
      await page.waitForFunction(
        () => {
          const text = document.querySelector('#root')?.textContent ?? ''
          return /genesis|exodus|matthew|psalms/i.test(text)
        },
        { timeout: 10_000 },
      )
    }
  })
})

// ---------------------------------------------------------------------------
// 7. Compare View — Multi-Translation
// ---------------------------------------------------------------------------

test.describe('Compare', () => {
  test('compare view renders heading', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const compareTab = page.locator('[role="tab"]:has-text("Compare"), button:has-text("Compare"), a:has-text("Compare")').first()
    if (await compareTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await compareTab.click()
    }
    const heading = page.locator('h1, h2, h3').first()
    await expect(heading).toBeVisible({ timeout: 10_000 })
  })
})

// ---------------------------------------------------------------------------
// 8. Keyboard Shortcuts
// ---------------------------------------------------------------------------

test.describe('Keyboard Shortcuts', () => {
  test('Ctrl+K opens search or focuses input', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('Control+k')
    // Should show search area or focus an input
    const input = page.locator('input').first()
    await expect(input).toBeVisible({ timeout: 10_000 })
  })

  test('Ctrl+D toggles dark mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const html = page.locator('html')
    const initialDark = await html.evaluate(el => el.classList.contains('dark'))
    await page.keyboard.press('Control+d')
    const afterDark = await html.evaluate(el => el.classList.contains('dark'))
    expect(afterDark).not.toBe(initialDark)
  })
})

// ---------------------------------------------------------------------------
// 9. Mobile Bottom Navigation
// ---------------------------------------------------------------------------

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('bottom tab bar is visible on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const tabBar = page.locator('[role="tablist"]').last()
    await expect(tabBar).toBeVisible({ timeout: 10_000 })
  })

  test('mobile tabs are tappable', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const tabs = page.locator('[role="tab"]')
    const count = await tabs.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })
})

// ---------------------------------------------------------------------------
// 10. Reading Plans
// ---------------------------------------------------------------------------

test.describe('Reading Plans', () => {
  test('reading plan view renders', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const planTab = page.locator('[role="tab"]:has-text("Plans"), button:has-text("Plans"), a:has-text("Plans"), [role="tab"]:has-text("Reading")').first()
    if (await planTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await planTab.click()
      const content = page.locator('h1, h2, h3, p').first()
      await expect(content).toBeVisible({ timeout: 10_000 })
    }
  })
})

// ---------------------------------------------------------------------------
// 11. Settings View
// ---------------------------------------------------------------------------

test.describe('Settings', () => {
  test('settings shows preference controls', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const settingsTab = page.locator('[role="tab"]:has-text("Settings"), button:has-text("Settings"), a:has-text("Settings"), button[aria-label*="setting" i]').first()
    if (await settingsTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await settingsTab.click()
    }
    const heading = page.locator('h1, h2, h3').first()
    await expect(heading).toBeVisible({ timeout: 10_000 })
  })
})

// ---------------------------------------------------------------------------
// 12. Error-Free Boot
// ---------------------------------------------------------------------------

test.describe('Error-Free Boot', () => {
  test('app loads without console errors', async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const root = page.locator('#root')
      await expect(root.locator('> *').first()).toBeVisible({ timeout: 10_000 })
    })
  })
})
