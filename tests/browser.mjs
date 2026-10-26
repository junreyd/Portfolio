import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

// Test the built site, including self-hosted workers/WASM, rather than Vite's development server.
const base = process.env.VITE_BASE_PATH || '/'
const url = process.env.TEST_URL || `http://127.0.0.1:4175${base}`
const server = process.env.TEST_URL
  ? null
  : spawn(
      process.execPath,
      [
        'node_modules/vite/bin/vite.js',
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        '4175',
        '--strictPort',
      ],
      { stdio: 'pipe', windowsHide: true },
    )
let serverOutput = ''
server?.stdout.on('data', (chunk) => (serverOutput += chunk))
server?.stderr.on('data', (chunk) => (serverOutput += chunk))
let browser
let page
const errors = []
const launchOptions = process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}

const settle = async () => {
  // The responsive orbit switches its DOM layout after its ResizeObserver runs.
  await page.waitForFunction(() => {
    const galaxy = document.querySelector('.skills-galaxy')
    return !galaxy || galaxy.dataset.compact === String(galaxy.clientWidth < 560)
  })
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  )
}
const outputIs = (expected) =>
  page.waitForFunction(
    (text) =>
      document.querySelector('.animated-result')?.dataset.status === 'success' &&
      document.querySelector('.animated-result .sr-only')?.textContent.trim() === text,
    expected,
    { timeout: 65000 },
  )
const audit = async (include) => {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
  if (include) builder = builder.include(include)
  const results = await builder.analyze()
  assert.deepEqual(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
    [],
  )
}

try {
  if (server) {
    let ready = false
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null) throw new Error(`Preview failed: ${serverOutput}`)
      try {
        ready = (await fetch(url)).ok
      } catch {
        /* Wait for the preview to listen. */
      }
      if (ready) break
      await delay(200)
    }
    assert.ok(ready, `Preview did not start: ${serverOutput}`)
  }
  browser = await chromium.launch(launchOptions)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: 'reduce',
  })
  page = await context.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  const requests = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto(url, { waitUntil: 'networkidle' })
  await outputIs('Built to make work simpler.')
  assert.equal(await page.locator('main > section[id]').count(), 6)
  const cv = page.getByText('Download CV', { exact: false })
  const cvAvailable = existsSync('public/resume/Junrey_Ducay_CV.pdf')
  assert.equal(await cv.getAttribute('aria-disabled'), String(!cvAvailable))
  if (cvAvailable) assert.match(await cv.getAttribute('href'), /resume\/Junrey_Ducay_CV\.pdf$/)
  else assert.equal(await cv.getAttribute('href'), null)
  assert.ok(
    !requests.some((request) => /runtimes\/python|sql-wasm|\/esm-/.test(request)),
    'Optional runtimes must load only on use',
  )

  for (const theme of ['dark', 'light']) {
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme
    }, theme)
    for (const width of [
      320, 360, 390, 430, 650, 699, 768, 899, 900, 1024, 1280, 1440, 1920, 2560,
    ]) {
      await page.setViewportSize({ width, height: 1000 })
      await settle()
      const layout = await page.evaluate(() => {
        const copy = document.querySelector('.hero-copy').getBoundingClientRect()
        const editor = document.querySelector('.code-window').getBoundingClientRect()
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          overlap:
            copy.left < editor.right &&
            copy.right > editor.left &&
            copy.top < editor.bottom &&
            copy.bottom > editor.top,
          clipped: [...document.querySelectorAll('h1,h2,h3,.email-link')]
            .filter((el) => el.scrollWidth > el.clientWidth + 2)
            .map((el) => el.textContent),
        }
      })
      assert.deepEqual(
        layout,
        { overflow: false, overlap: false, clipped: [] },
        `${theme} layout at ${width}px`,
      )
    }
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await settle()
      for (const section of await page.locator('main > section[id]').all())
        await section.scrollIntoViewIfNeeded()
      await audit()
    }
  }
  console.log(
    'PASS: both themes, 14 viewport widths, no overlap/overflow/clipped headings, accessibility',
  )

  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light')
  await page.getByRole('button', { name: 'Copy email', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('.copy-status').textContent.length > 0)
  // Headless engines without clipboard permission must still present a useful failure message.
  assert.match(
    await page.locator('.copy-status').textContent(),
    /Email copied|Please select and copy/,
  )
  assert.equal(await page.locator('.email-link').getAttribute('href'), 'mailto:ducjunrey@gmail.com')
  assert.match(await page.locator('.phone-link').getAttribute('href'), /^tel:\+/)

  await page.getByRole('button', { name: 'Write your code with me' }).click()
  const input = page.getByRole('textbox', { name: 'Write your code with me' })
  const language = page.getByLabel('Programming language')
  for (const [id, code, expected] of [
    ['javascript', 'console.log("JavaScript works.");', 'JavaScript works.'],
    ['typescript', 'const n: number = 21;\nconsole.log(n * 2);', '42'],
    ['python', 'print(sum([10, 20, 12]))', '42'],
    ['sql', 'SELECT 42 AS result;', '42'],
  ]) {
    await language.selectOption(id)
    await input.fill(code)
    await page.getByRole('button', { name: 'Run', exact: true }).click()
    await outputIs(expected)
  }
  await language.selectOption('javascript')
  assert.equal(await input.inputValue(), 'console.log("JavaScript works.");')
  await input.fill('console.log("<b>Plain text.</b>");')
  await input.press('Control+Enter')
  await outputIs('<b>Plain text.</b>')
  assert.equal(await page.locator('.animated-result b').count(), 0)
  await input.fill('x'.repeat(43))
  assert.notEqual(await input.inputValue(), 'x'.repeat(43))
  assert.equal(await page.getByRole('alert').textContent(), 'Compiled Error')
  await input.fill('const = ;')
  await page.getByRole('button', { name: 'Run', exact: true }).click()
  await page.waitForFunction(
    () => document.querySelector('.animated-result').dataset.status === 'error',
  )
  await input.fill('while (true) {}')
  await page.getByRole('button', { name: 'Run', exact: true }).click()
  await page.waitForFunction(
    () => document.querySelector('.animated-result').dataset.status === 'error',
    null,
    { timeout: 12000 },
  )
  await input.fill('console.log("Recovered.");')
  await page.getByRole('button', { name: 'Run', exact: true }).click()
  await outputIs('Recovered.')
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    await settle()
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      `editing at ${width}px`,
    )
  }
  await audit('.interactive-editor')
  await page.getByRole('button', { name: 'Return to autoplay', exact: true }).click()
  await outputIs('Built to make work simpler.')
  console.log(
    'PASS: JS/TS/Python/SQL, drafts, shortcut, input limits, plain text, timeout recovery, mobile editing, theme/contact actions',
  )

  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.locator('#projects').scrollIntoViewIfNeeded()
  const projectCount = await page.locator('.project-slide').count()
  const visibleProjects = await page.locator('.project-slide:not([inert])').count()
  for (let index = 0; index < projectCount; index++) {
    await page.getByRole('button', { name: 'Previous projects', exact: true }).focus()
    await page.keyboard.press('Home')
    for (let step = 0; step < Math.min(index, projectCount - visibleProjects); step++)
      await page.keyboard.press('ArrowRight')
    const trigger = page
      .locator('.project-slide')
      .nth(index)
      .getByRole('button', { name: /View details for/ })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await dialog.waitFor({ state: 'visible' })
    await dialog.locator('.dialog-image').evaluate((image) => image.decode())
    assert.match(
      await dialog.textContent(),
      /Overview[\s\S]*Business problem[\s\S]*Features[\s\S]*Outcome/,
    )
    for (const thumbnail of await dialog.locator('.project-gallery-thumbnails button').all()) {
      await thumbnail.click()
      await dialog.locator('.dialog-image').evaluate((image) => image.decode())
      assert.equal(await thumbnail.getAttribute('aria-pressed'), 'true')
    }
    await dialog.getByRole('button', { name: 'Enlarge image', exact: true }).click()
    assert.equal(
      await dialog
        .getByRole('button', { name: 'Fit image', exact: true })
        .getAttribute('aria-expanded'),
      'true',
    )
    if (index === 0) {
      await dialog.evaluate((element) => {
        element.scrollTop = element.scrollHeight
      })
      const close = await dialog
        .getByRole('button', { name: 'Close project details', exact: true })
        .boundingBox()
      assert.ok(
        close && close.y >= 0 && close.y + close.height <= 1100,
        'Close control remains onscreen',
      )
      await audit('.project-dialog')
      await page.keyboard.press('Tab')
      assert.equal(
        await page.evaluate(() => document.activeElement.closest('dialog') !== null),
        true,
      )
    }
    await page.keyboard.press('Escape')
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true)
  }
  console.log(
    'PASS: all 13 project dialogs and gallery images, enlarge, focus trapping/restoration, sticky close control',
  )

  await page.setViewportSize({ width: 390, height: 844 })
  const invitation = await page
    .getByRole('button', { name: 'Write your code with me' })
    .boundingBox()
  assert.ok(
    invitation && invitation.height >= 44,
    'The scaled mobile editor invitation is easy to tap',
  )
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Skills', exact: true })
    .click()
  assert.equal(
    await page
      .getByRole('button', { name: 'Open navigation', exact: true })
      .getAttribute('aria-expanded'),
    'false',
  )
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page.keyboard.press('Escape')
  assert.equal(
    await page
      .getByRole('button', { name: 'Open navigation', exact: true })
      .evaluate((element) => element === document.activeElement),
    true,
  )
  await page.setViewportSize({ width: 568, height: 320 })
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  const mobileContact = page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Contact', exact: true })
  await mobileContact.scrollIntoViewIfNeeded()
  await mobileContact.click()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.skills-galaxy').scrollIntoViewIfNeeded()
  await page.locator('.skills-galaxy button[tabindex="0"]').focus()
  await page.keyboard.press('End')
  assert.equal(await page.locator('.skills-galaxy').getAttribute('data-active-skill'), 'github')
  await page.keyboard.press('Home')
  assert.equal(await page.locator('.skills-galaxy').getAttribute('data-active-skill'), 'sharepoint')
  assert.deepEqual(errors, [])
  console.log('PASS: mobile/landscape navigation, keyboard skill paging, no runtime/asset errors')

  // Exercise real motion separately from the reduced-motion layout/accessibility pass.
  page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: 'no-preference',
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    window.completedAnimations = []
    new MutationObserver((records) => {
      for (const record of records) {
        const node = record.target
        if (
          record.attributeName === 'data-phase' &&
          node.matches?.('.animated-result') &&
          node.dataset.phase === 'erasing'
        )
          window.completedAnimations.push(node.dataset.status)
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-phase'] })
  })
  await page.goto(url)
  const phase = (value) =>
    page.waitForFunction(
      (phase) => document.querySelector('.animated-result').dataset.phase === phase,
      value,
    )
  await phase('erasing')
  await phase('text')
  await page.getByRole('button', { name: 'Write your code with me' }).click()
  const animatedInput = page.getByRole('textbox', { name: 'Write your code with me' })
  await animatedInput.fill(
    'await new Promise(r=>setTimeout(r,800));\nconsole.log("Better workdays.");',
  )
  const starts = await page.evaluate(() => window.completedAnimations.length)
  await page.getByRole('button', { name: 'Run', exact: true }).click()
  await page.waitForFunction(
    () => document.querySelector('.animated-result').dataset.status === 'running',
  )
  assert.equal(await page.locator('.animated-result').getAttribute('data-phase'), 'text')
  await phase('erasing')
  await phase('hidden')
  assert.equal(
    await page.locator('.result-words').evaluate((node) => getComputedStyle(node).visibility),
    'hidden',
  )
  await phase('drawing')
  await phase('text')
  await outputIs('Better workdays.')
  assert.equal(await page.evaluate(() => window.completedAnimations.length), starts + 1)
  await page.getByRole('button', { name: 'Run', exact: true }).click()
  await phase('erasing')
  await page.evaluate(() => scrollTo({ top: 2000, behavior: 'instant' }))
  await phase('text')
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await settle()
  assert.equal(await page.locator('.animated-result').getAttribute('data-phase'), 'text')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(
    () => document.querySelector('.hero-universe').dataset.running === 'false',
  )
  await animatedInput.fill('console.log("Motion preference works.");')
  await page.getByRole('button', { name: 'Run', exact: true }).click()
  await outputIs('Motion preference works.')
  assert.equal(await page.locator('.animated-result').getAttribute('data-phase'), 'text')
  assert.equal(await page.locator('.workflow-visual').getAttribute('data-running'), 'false')
  assert.equal(await page.locator('.meteor-name').getAttribute('data-animate'), 'false')
  assert.deepEqual(errors, [])
  console.log(
    'PASS: stroke erase/hold/draw, repeated runs, offscreen settling, live reduced-motion preference',
  )
} catch (error) {
  if (page && !page.isClosed()) {
    await mkdir('test-results', { recursive: true })
    await page
      .screenshot({ path: 'test-results/browser-failure.png', fullPage: true })
      .catch(() => {})
  }
  throw error
} finally {
  await browser?.close()
  server?.kill()
}
