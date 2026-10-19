import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'sentinel-handoff/design-system/tokens.css');
const css = postcss.parse(fs.readFileSync(source, 'utf8'));
css.walkAtRules('import', rule => rule.remove());
css.walkRules(rule => { rule.selector = rule.selector === ':root' ? '.sentinel-scope' : rule.selector.split(',').map(selector => `.sentinel-scope ${selector.trim()}`).join(', '); });
fs.writeFileSync(path.join(root, 'src/features/sentinel/tokens.scoped.css'), `/* Generated from sentinel-handoff/design-system/tokens.css. Run npm run sentinel:prepare. */\n${css.toString()}`);
