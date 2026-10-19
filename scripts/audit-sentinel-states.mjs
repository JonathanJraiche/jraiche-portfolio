// Read-only axe audits of rendered development fixtures, without simulated UI actions.
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const base = process.env.SENTINEL_AUDIT_ORIGIN || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel:'chrome',headless:true });
const results=[];
try {
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  for(const state of ['library','picker','hover-plot','hover-log','placed','move','resize','menu','save','view','maintainer','unknown','discard','exit','settings','rename','undo']) {
    const page=await context.newPage();
    await page.goto(`${base}/tests/sentinel-audit.html?state=${state}`);
    await page.locator('.sn-console').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    const audit=await new AxeBuilder({page}).include('.sn-console').analyze();
    results.push({state,violations:audit.violations,passes:audit.passes.length});
    if(audit.violations.length)process.exitCode=1;
    if(['library','maintainer','save'].includes(state))await page.screenshot({path:`docs/sentinel-state-${state}.png`});
    await page.close();
  }
  await writeFile('docs/sentinel-axe-states.json',JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results.map(({state,violations,passes})=>({state,violations:violations.map(v=>v.id),passes})),null,2));
}finally{await browser.close();}
