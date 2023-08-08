import * as core from '@actions/core';
import { createPackages } from './createPackages';
import { PublishType } from './constants';

// eslint-disable-next-line @typescript-eslint/require-await
async function run(): Promise<void> {
  try {
    core.debug(`Parsing inputs`);
    const outDir = core.getInput('out_dir');
    const publishType = core.getInput('publish_type') as PublishType;
    const packageName = core.getInput('package_name');

    if (!Object.values(PublishType).includes(publishType)) {
      throw new Error(`Invalid input for publish_type. Valid inputs are : ${Object.values(PublishType).join(', ')}`);
    }

    createPackages(outDir, publishType, packageName);
    core.setOutput('passed', true);
  } catch (e) {
    const error = e as Error;
    const message = error.message ?? error;
    core.debug(`Error: ${message}`);
    core.setFailed(message);
  }
}

void run();
