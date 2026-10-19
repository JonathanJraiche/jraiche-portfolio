// Read-only rendering checks across Chromium, Firefox, and WebKit.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, firefox, webkit } from 'playwright-core';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const base = process.env.SENTINEL_AUDIT_ORIGIN || 'http://127.0.0.1:5173';
const screenshots = '/tmp/sentinel-icon-audit';
const states = ['library', 'picker', 'hover-plot', 'hover-log', 'placed', 'move', 'resize', 'menu', 'save', 'view', 'maintainer', 'unknown', 'discard', 'settings', 'rename', 'undo'];
const reports = [];
await mkdir(screenshots, { recursive: true });

for (const [name, engine] of Object.entries({ chromium, webkit, firefox })) {
  let browser;
  try {
    browser = await engine.launch({ headless: true, ...(name === 'chromium' ? { channel: 'chrome' } : {}) });
  } catch (error) {
    // On newer macOS versions the bundled Firefox can fail before creating its
    // profile. Use native Firefox's read-only screenshot mode for visual review.
    if (name === 'firefox' && process.platform === 'darwin') {
      const nativeFirefox = process.env.SENTINEL_FIREFOX_PATH || '/Applications/Firefox.app/Contents/MacOS/firefox';
      const { readdir, mkdtemp, stat, rm } = await import('node:fs/promises');
      const profile = await mkdtemp('/tmp/sentinel-firefox-');
      const screens = (await readdir(new URL('../src/assets/sentinel/', import.meta.url)))
        .filter(file => file.endsWith('.png')).map(file => file.replace('.png', ''));
      const targets = [
        ...screens.map(screen => ({ name: screen, url: `${base}/tests/sentinel-figures.html?screen=${screen}` })),
        ...states.map(state => ({ name: `state-${state}`, url: `${base}/tests/sentinel-audit.html?state=${state}` })),
      ];
      try {
        for (const target of targets) {
          const path = `${screenshots}/firefox-${target.name}.png`;
          await promisify(execFile)(nativeFirefox, ['--headless', '--no-remote', '--profile', profile, '--screenshot', path, '--window-size', '1440,1100', target.url], { timeout: 20000 });
          assert.ok((await stat(path)).size > 1000);
        }
      } finally { await rm(profile, { recursive: true, force: true }); }
      reports.push({ browser: name, status: 'screenshots-for-visual-review', figures: screens, states, automatedDriverUnavailable: true });
      console.log(`firefox: native browser captured 13 figures and ${states.length} live states for visual review.`);
    } else {
      reports.push({ browser: name, status: 'unavailable', reason: error.message });
      console.error(`${name}: browser could not start.`);
      process.exitCode = 1;
    }
    continue;
  }
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/tests/sentinel-figures.html`);
    const images = page.locator('[data-figure] img');
    await images.first().waitFor();
    assert.equal(await images.count(), 13);
    const figures = [];
    for (const image of await images.all()) {
      await image.evaluate(img => img.decode());
      const screen = await image.evaluate(img => img.closest('[data-figure]').dataset.figure);
      const response = await page.request.get(new URL(await image.getAttribute('src'), page.url()).href);
      assert.equal(response.status(), 200);
      assert.match(response.headers()['content-type'], /image\/png/);
      assert.equal(await image.evaluate(img => img.naturalWidth), 2880);
      await image.screenshot({ path: `${screenshots}/${name}-${screen}.png` });
      figures.push({ screen, loaded: true, naturalWidth: 2880 });
    }
    const live = [];
    for (const state of states) {
      await page.goto(`${base}/tests/sentinel-audit.html?state=${state}`);
      await page.locator('.sn-console').waitFor();
      const icons = await page.locator('.sn-topbar-actions > button > svg, .sn-topbar-actions > .sn-tooltip-anchor > button > svg').evaluateAll(elements => elements.map(svg => {
        const box = svg.getBBox();
        const viewport = svg.viewBox.baseVal;
        return {
          label: svg.closest('button')?.getAttribute('aria-label') || svg.closest('button')?.textContent.trim(),
          viewport: [viewport.x, viewport.y, viewport.width, viewport.height],
          bounds: [box.x, box.y, box.width, box.height],
          width: svg.getBoundingClientRect().width,
          height: svg.getBoundingClientRect().height,
        };
      }));
      assert.ok(icons.length >= 2, `${name}/${state}: missing header icons`);
      for (const icon of icons) {
        assert.deepEqual(icon.viewport, [0, 0, 24, 24]);
        assert.equal(icon.width, 16);
        assert.equal(icon.height, 16);
        const [x, y, width, height] = icon.bounds;
        assert.ok(x >= 1 && y >= 1 && x + width <= 23 && y + height <= 23, `${name}/${state}/${icon.label}: clipped geometry`);
      }
      if (state === 'view') await page.locator('.sn-topbar').screenshot({ path: `${screenshots}/${name}-live-header.png` });
      live.push({ state, icons });
    }
    assert.deepEqual(errors, [], `${name}: browser errors`);
    reports.push({ browser: name, status: 'passed', version: browser.version(), figures, live, errors });
    console.log(`${name}: 13 figures and ${states.length} live states passed.`);
  } finally { await browser.close(); }
}
await writeFile('docs/sentinel-icons.json', JSON.stringify(reports, null, 2) + '\n');
