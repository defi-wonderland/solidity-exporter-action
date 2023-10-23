import * as core from '@actions/core';
import { createPackage } from './createPackage';
import { ExportType } from './constants';

// eslint-disable-next-line @typescript-eslint/require-await
async function run(): Promise<void> {
  try {
    core.debug(`Parsing inputs`);
    const outDir = core.getInput('out_dir');
    const exportType = core.getInput('typing_type') as ExportType;
    const packageName = core.getInput('package_name');
    const interfacesDir = core.getInput('interfaces_dir');
    const contractsDir = core.getInput('contracts_dir') || '';

    if (!Object.values(ExportType).includes(exportType)) {
      throw new Error(`Invalid input for typing_type. Valid inputs are: ${Object.values(ExportType).join(', ')}`);
    }

    core.debug(`Creating package`);
    createPackage(outDir, interfacesDir, contractsDir, packageName, exportType);
    core.setOutput('passed', true);
  } catch (e) {
    const error = e as Error;
    const message = error.message ?? error;
    core.debug(`Error: ${message}`);
    core.setFailed(message);
  }
}

void run();
