import fse from 'fs-extra';
import { createPackage } from './createPackage';
import { PublishType, ethersDependencies, web3Dependencies } from './constants';
import { execSync } from 'child_process';

export const createPackages = (outDir: string, publishType: PublishType, packageName: string) => {
  // Empty export directory
  fse.emptyDirSync(packageName);

  console.log('Installing dependencies');
  execSync('yarn');

  // Create custom package.json in the export directory
  const wholePackage = fse.readJsonSync('./package.json');

  // Checks if exist
  if (!wholePackage) return;

  // Add additional dependencies if needed
  let additionalDependencies: Record<string, string> = {};
  if (publishType === PublishType.ETHERS_V6) additionalDependencies = ethersDependencies;
  if (publishType === PublishType.WEB3_V1) additionalDependencies = web3Dependencies;

  const packageJson = {
    name: packageName,
    version: wholePackage.version,
    dependencies: {
      ...wholePackage.dependencies,
      ...additionalDependencies,
    },
  };

  // Create package
  createPackage(packageName, outDir, packageJson, publishType);
};
