import fse from 'fs-extra';

export const createReadmeAndLicense = (packageName: string, exportDir: string) => {
  const readmeContent = `
  ## ${packageName}
  This package includes all of the needed resources in order to integrate ${packageName} into your scripts, UI, or smart-contracts:

  ## Installation
  You can install this package via npm or yarn:
  
  \`\`\`console
  yarn add ${packageName}
  \`
  
  \`\`\`console
  npm install ${packageName}
  \`
  
  ## License
  The primary license for ${packageName} is MIT, see [\`LICENSE\`](./LICENSE).`;

  const licensePath = './LICENSE';
  if (fse.existsSync(licensePath)) {
    fse.copySync(licensePath, `${exportDir}/LICENSE`);
  }
  // Write readme file
  fse.writeFileSync(`${exportDir}/README.MD`, readmeContent);
};
