import * as core from '@actions/core';
import { createPackage } from './createPackage';
import { ExportType } from './constants';

// eslint-disable-next-line @typescript-eslint/require-await
async function run(): Promise<void> {
  try {
    core.debug(`Parsing inputs`);
    const packageName = core.getInput('package_name');
    const outDir = core.getInput('out');
    const interfacesDir = core.getInput('interfaces');
    const contractsDir = core.getInput('contracts');
    const librariesDir = core.getInput('libraries');
    const exportType = core.getInput('export_type') as ExportType;

    if (!Object.values(ExportType).includes(exportType)) {
      throw new Error(`Invalid input for export_type. Valid inputs are: ${Object.values(ExportType).join(', ')}`);
    }

    core.debug(`Creating package`);
    createPackage(outDir, interfacesDir, contractsDir, librariesDir, packageName, exportType);
    core.setOutput('passed', true);
  } catch (e) {
    const error = e as Error;
    const message = error.message ?? error;
    core.debug(`Error: ${message}`);
    core.setFailed(message);
  }
}

void run();
