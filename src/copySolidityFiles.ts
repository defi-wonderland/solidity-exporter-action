import glob from 'glob';
import path from 'path';
import fse from 'fs-extra';
import { transformRemappings } from './transformRemappings';

export const copySolidityFiles = (baseDir: string, filesDir: string, destinationDir: string) => {
  const filesDestination = `${destinationDir}/${filesDir}`;
  const abiDestination = `${destinationDir}/abi`;

  // List all of the solidity files on the input directory
  const filesGlob = `${filesDir}/**/*.sol`;
  glob(filesGlob, (err, filesPaths) => {
    if (err) throw err;

    for (const filePath of filesPaths) {
      const file = fse.readFileSync(filePath, 'utf8');
      const relativeFile = transformRemappings(file);

      // Copy the file to the destination directory
      const relativeFilePath = filePath.substring(filesDir.length + 1);
      fse.outputFileSync(path.join(filesDestination, relativeFilePath), relativeFile);
      console.log(`Copied ${relativeFilePath} to ${filesDestination}`);

      // Copy the abi to the export directory using the same file name
      const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
      fse.copySync(`${baseDir}/${fileName}.sol/${fileName}.json`, `${abiDestination}/${fileName}.json`);
      console.log(`Copied ${fileName}.json to ${abiDestination}`);
    }

    console.log(`Copied ${filesPaths.length} interfaces and ABIs`);
  });
};
