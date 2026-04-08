import * as path from 'node:path';

import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    await runTests({
      extensionDevelopmentPath: path.resolve(__dirname, '../..'),
      extensionTestsPath: path.resolve(__dirname, './suite/index'),
      version: '1.85.0',
    });
  } catch (error) {
    console.error('Failed to run extension tests.');
    console.error(error);
    process.exit(1);
  }
}

void main();
