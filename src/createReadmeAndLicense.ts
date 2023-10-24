import fse from 'fs-extra';
import { ExportType } from './constants';
import { publicTypeLabels } from './types';

export const createReadmeAndLicense = (packageName: string, exportType: ExportType, exportDir: string) => {
  const readmeContent = `
  [![npm version](https://img.shields.io/npm/v/${packageName}/latest.svg)](https://www.npmjs.com/package/${packageName}/v/latest)

  # ${packageName}

  ${packageName} offers support for ${publicTypeLabels[exportType]} typing for seamless interactions with smart contracts. 
  Integrate these interfaces effortlessly into your projects.

  ## Installation
  
  You can easily install this package using either npm or yarn:
  
  Using Yarn:
  \`\`\`sh
  yarn add ${packageName}
  \`\`\`
  
  Using npm:
  \`\`\`sh
  npm install ${packageName}
  \`\`\`
  

  ## Usage

  This is an example of how you can import an interface:

  \`\`\`typescript
  import { ISomeInterface } from '${packageName}';
  import { SomeContract } from '${packageName}';
  \`\`\`

  And then you can interact with it in the way you need.

  ## Repository

  To learn more about this package, please visit the [solidity-exporter-action-private](https://github.com/defi-wonderland/solidity-exporter-action-private) repo.

  ## Contributors

  Maintained with love by [Wonderland](https://defi.sucks). Made possible by viewers like you.

  ## License
  
  ${packageName} is licensed under the [MIT License](LICENSE).

  `;

  const licensePath = './LICENSE';
  if (fse.existsSync(licensePath)) {
    fse.copySync(licensePath, `${exportDir}/LICENSE`);
  }
  // Write readme file
  fse.writeFileSync(`${exportDir}/README.MD`, readmeContent);
};
