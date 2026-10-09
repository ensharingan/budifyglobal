#!/usr/bin/env node
// Writes an audit record of the compliance configuration that this deployment was built with.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { compliance, root } from './lib.mjs';

const raw = fs.readFileSync(path.join(root, 'compliance.config.json'));
const cfg = compliance();
const entities = fs.readFileSync(path.join(root, 'content/entities.json'), 'utf8');
const record = {
  type: 'compliance-audit',
  builtAt: new Date().toISOString(),
  configVersion: cfg.version,
  consentVersion: cfg.consentVersion,
  configSha256: crypto.createHash('sha256').update(raw).digest('hex'),
  markets: Object.keys(cfg.markets),
  locales: Object.values(cfg.markets).flatMap((m) => m.languages),
  entityPlaceholdersRemaining: (entities.match(/\[TO BE COMPLETED/g) ?? []).length,
  strictLaunch: process.env.STRICT_LAUNCH === '1',
  indexingAllowed: process.env.ALLOW_INDEXING === '1',
  git: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  vercelEnv: process.env.VERCEL_ENV ?? null,
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null
};
fs.writeFileSync(path.join(root, 'public/compliance-audit.json'), JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify(record)); // build logs act as the per-deployment audit trail
