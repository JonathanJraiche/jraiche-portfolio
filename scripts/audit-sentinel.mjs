// Read-only accessibility and layout audits of the running local build.
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const url = process.env.SENTINEL_AUDIT_URL || 'http://127.0.0.1:5173/#/work/sentinel';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const reports = [];
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(url);
    await page.locator('#sentinel-title').waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (viewport.width === 1440 || viewport.width === 390) await page.screenshot({ path: `docs/sentinel-${viewport.width}.png`, fullPage: false });
    const axe = await new AxeBuilder({ page }).analyze();
    const layout = await page.evaluate(() => ({
      viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
      consoles: document.querySelectorAll('.sn-console').length,
      fallbackFigures: document.querySelectorAll('.case-mobile-sequence img').length,
      portfolioMono: getComputedStyle(document.querySelector('.case-meta')).fontFamily,
      prototypeMono: document.querySelector('.sn-console .data-m') && getComputedStyle(document.querySelector('.sn-console .data-m')).fontFamily,
      fontTokenOutside: getComputedStyle(document.body).getPropertyValue('--surface-base'),
      consoleSizes: [...document.querySelectorAll('.sn-console')].map(element => ({ width: element.clientWidth, height: element.clientHeight, scrollWidth: element.scrollWidth })),
      emDashes: document.body.innerText.includes('\u2014'),
      reducedMotionTransitions: [...document.querySelectorAll('.sn-console *')].some(element => getComputedStyle(element).transitionDuration !== '0s'),
    }));
    reports.push({ viewport, layout, violations: axe.violations, incomplete: axe.incomplete.map(rule => ({ id: rule.id, nodes: rule.nodes.length })), passes: axe.passes.length });
    if (axe.violations.length || layout.documentWidth > viewport.width || layout.emDashes || layout.fontTokenOutside.trim()) process.exitCode = 1;
    await context.close();
  }
  await writeFile('docs/sentinel-axe.json', JSON.stringify(reports, null, 2) + '\n');
  console.log(JSON.stringify(reports.map(({ viewport, layout, violations, passes }) => ({ viewport, layout, violations: violations.map(rule => rule.id), passes })), null, 2));
} finally { await browser.close(); }
