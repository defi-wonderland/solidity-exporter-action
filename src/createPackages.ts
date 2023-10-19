import fse from 'fs-extra';
import { createPackage } from './createPackage';
import { TypingType } from './constants';
import { execSync } from 'child_process';

export const createPackages = (
  outDir: string,
  typingType: TypingType,
  packageName: string,
  destinationDir: string,
  interfacesDir: string,
  contractsDir: string,
) => {
  // Empty export directory
  fse.emptyDirSync(destinationDir);

  console.log('Installing dependencies');
  execSync('yarn');

  // Create custom package.json in the export directory
  const wholePackage = fse.readJsonSync('./package.json');

  // Checks if exist
  if (!wholePackage) return;

  const packageJson = {
    name: packageName,
    version: wholePackage.version,
    dependencies: {
      ...wholePackage.dependencies,
    },
  };

  // Create package
  createPackage(destinationDir, outDir, interfacesDir, contractsDir, packageJson, typingType);
};
