import * as core from '@actions/core';
import { createPackages } from './createPackages';
import { TypingType } from './constants';

// eslint-disable-next-line @typescript-eslint/require-await
async function run(): Promise<void> {
  try {
    core.debug(`Parsing inputs`);
    const outDir = core.getInput('out_dir');
    const typingType = core.getInput('typing_type') as TypingType;
    const packageName = core.getInput('package_name');
    const destinationDir = core.getInput('destination_dir');

    if (!Object.values(TypingType).includes(typingType)) {
      throw new Error(`Invalid input for typing_type. Valid inputs are : ${Object.values(TypingType).join(', ')}`);
    }

    createPackages(outDir, typingType, packageName, destinationDir);
    core.setOutput('passed', true);
  } catch (e) {
    const error = e as Error;
    const message = error.message ?? error;
    core.debug(`Error: ${message}`);
    core.setFailed(message);
  }
}

void run();
