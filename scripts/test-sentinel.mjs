import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const dir = await mkdtemp(path.join(tmpdir(), 'sentinel-test-'));
try {
  const outfile = path.join(dir, 'tests.mjs');
  await build({ entryPoints: ['tests/sentinel-model.test.js'], bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent' });
  const result = spawnSync(process.execPath, ['--test', outfile], { stdio: 'inherit' });
  process.exitCode = result.status;
} finally { await rm(dir, { recursive: true, force: true }); }
