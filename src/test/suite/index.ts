import { runExtensionTests } from '../extension.test';

type TestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: TestCase[] = [
  {
    name: 'Commands are registered',
    run: runExtensionTests,
  },
];

export async function run() {
  for (const testCase of testCases) {
    try {
      await testCase.run();
      console.log(`PASS ${testCase.name}`);
    } catch (error) {
      console.error(`FAIL ${testCase.name}`);
      throw error;
    }
  }
}
