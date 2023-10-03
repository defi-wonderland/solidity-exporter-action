import fse from 'fs-extra';
import { TypingType } from './constants';
import { publicTypeLabels } from './types';

export const createReadmeAndLicense = (packageName: string, typingType: TypingType, exportDir: string) => {
  const readmeContent = `
  # ${packageName}

  ${packageName} offers ${publicTypeLabels[typingType]} for seamless interactions with smart contracts. Integrate these interfaces effortlessly into your projects.
  
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
