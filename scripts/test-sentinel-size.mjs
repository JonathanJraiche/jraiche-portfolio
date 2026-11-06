// Requires the development server and local Google Chrome, like the Sentinel audits.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = process.env.SENTINEL_AUDIT_ORIGIN || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const dimensions = locator => locator.evaluate(element => ({ width: element.clientWidth, height: element.clientHeight }));
try {
  for (const width of [1440, 1280, 1024]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    try {
      await page.goto(`${base}/#/work/sentinel`);
      const frame = page.locator('#sentinel-builder .sn-console');
      await frame.waitFor();
      await page.evaluate(() => document.fonts.ready);
      const frameSize = await dimensions(frame);
      const checkFrame = async () => assert.deepEqual(await dimensions(frame), frameSize, `Frame changed at ${width}px`);
      await frame.getByRole('button', { name: /My watch layout/ }).click();
      await checkFrame();
      await frame.getByRole('button', { name: 'Add widget', exact: true }).click();
      const canvas = frame.locator('.sn-canvas');
      const canvasSize = await dimensions(canvas);
      for (const name of ['Situation Plot', 'Event Log', 'System Health', 'Trend Plot']) {
        if (name !== 'Situation Plot') await frame.getByRole('button', { name: 'Add widget', exact: true }).click();
        const count = await frame.locator('[data-widget]').count();
        await frame.getByRole('button', { name: new RegExp(`${name}.*[0-9]×[0-9]+`) }).click();
        assert.equal(await frame.locator('[data-widget]').count(), count + 1);
        await checkFrame();
        assert.deepEqual(await dimensions(canvas), canvasSize, `Canvas changed after ${name} at ${width}px`);
      }
      await frame.locator('[data-widget-focus]').last().press('ArrowDown');
      await frame.locator('[data-widget-focus]').last().press('Shift+ArrowDown');
      await checkFrame();
      await frame.getByRole('button', { name: 'Save configuration', exact: true }).first().click();
      await checkFrame();
      await frame.getByRole('button', { name: 'Save', exact: true }).click();
      await checkFrame();
      await frame.getByRole('button', { name: 'Close console', exact: true }).click();
      await checkFrame();
      await page.reload();
      await frame.waitFor();
      await checkFrame();
      console.log(`PASS ${width}px: frame and canvas stay fixed through additions, editing, save, and reload`);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
