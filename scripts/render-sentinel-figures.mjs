// Export static figures at 2x resolution to avoid WebKit foreignObject scaling bugs.
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const directory = new URL('../src/assets/sentinel/', import.meta.url);
const server = createServer(async (request, response) => {
  const name = new URL(request.url, 'http://localhost').pathname.slice(1);
  if (!/^[A-Za-z-]+\.svg$/.test(name)) { response.writeHead(404).end(); return; }
  try {
    response.setHeader('Content-Type', 'image/svg+xml');
    response.end(await readFile(new URL(name, directory)));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const file of (await readdir(directory)).filter(name => name.endsWith('.svg')).sort()) {
    await page.setViewportSize({ width: 1440, height: file === 'Maintainer.svg' ? 1040 : 900 });
    await page.goto(`http://127.0.0.1:${server.address().port}/${file}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: fileURLToPath(new URL(file.replace('.svg', '.png'), directory)) });
  }
  console.log('Rendered 13 Sentinel figures at 2x resolution.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
