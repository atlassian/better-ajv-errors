#!/usr/bin/env node

/**
 * Publishes this package to the @atlassian namespace.
 *
 * Usage:
 *   node publish-atlassian.js [--dry-run] [--tag <tag>] [--userconfig <path>]
 *
 * Options:
 *   --dry-run     Show what would be published without actually publishing
 *   --tag         Publish with a specific dist-tag (default: latest)
 *   --userconfig  Path to npmrc file for authentication (for CI)
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ATLASSIAN_NAME = '@atlassian/better-ajv-errors';
const ATLASSIAN_REGISTRY = 'https://packages.atlassian.com/api/npm/npm-public/';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    tag: 'latest',
    userconfig: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--tag' && args[i + 1]) {
      options.tag = args[++i];
    } else if (args[i] === '--userconfig' && args[i + 1]) {
      // `npm publish` runs in a temp directory, so a relative path would not find the file.
      options.userconfig = resolve(args[++i]);
    }
  }

  return options;
}

// Arguments go to the process without a shell, so paths with spaces or shell metacharacters stay intact.
function run(file, args, options = {}) {
  console.log(`$ ${[file, ...args].join(' ')}`);
  return execFileSync(file, args, { stdio: 'inherit', ...options });
}

function main() {
  const options = parseArgs();
  const rootDir = process.cwd();

  // Read original package.json for version info
  const pkgJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
  const version = pkgJson.version;

  console.log(`\nPublishing ${ATLASSIAN_NAME}@${version}\n`);

  // Create a temp directory for our work
  const tempDir = mkdtempSync(join(tmpdir(), 'atlassian-publish-'));
  console.log(`Working in: ${tempDir}\n`);

  try {
    // The tarball name follows npm's convention: {name}-{version}.tgz
    const tarballName = `better-ajv-errors-${version}.tgz`;
    const tarballPath = join(rootDir, tarballName);

    // Pack the package directly into the root directory
    // Use --ignore-scripts to avoid prepare script interfering
    run('npm', ['pack', '--ignore-scripts', '--pack-destination', rootDir]);

    if (!existsSync(tarballPath)) {
      throw new Error(`Tarball not found at ${tarballPath}. Did npm pack succeed?`);
    }

    console.log(`\nCreated tarball: ${tarballName}\n`);

    // Extract tarball to temp dir
    run('tar', ['-xzf', tarballPath, '-C', tempDir]);

    // Modify package.json in extracted package
    const extractedPkgPath = join(tempDir, 'package', 'package.json');
    const extractedPkg = JSON.parse(readFileSync(extractedPkgPath, 'utf-8'));

    extractedPkg.name = ATLASSIAN_NAME;
    extractedPkg.publishConfig = {
      registry: ATLASSIAN_REGISTRY,
    };

    writeFileSync(extractedPkgPath, JSON.stringify(extractedPkg, null, 2) + '\n');
    console.log(`Updated package name to: ${ATLASSIAN_NAME}`);
    console.log(`Set publishConfig.registry to: ${ATLASSIAN_REGISTRY}\n`);

    // Publish from the extracted directory
    // Use --ignore-scripts to skip lifecycle scripts (prepare, etc.) since we're in a temp dir without node_modules
    const publishArgs = ['publish', '--ignore-scripts', '--tag', options.tag];
    if (options.dryRun) {
      publishArgs.push('--dry-run');
    }
    if (options.userconfig) {
      publishArgs.push(`--userconfig=${options.userconfig}`);
    }

    run('npm', publishArgs, { cwd: join(tempDir, 'package') });

    // Clean up the original tarball
    rmSync(tarballPath);

    console.log(`\n✅ Successfully published ${ATLASSIAN_NAME}@${version}`);
  } finally {
    // Clean up temp directory
    rmSync(tempDir, { recursive: true, force: true });
  }
}

try {
  main();
} catch (err) {
  console.error('\n❌ Failed to publish:', err.message);
  process.exit(1);
}
