import { TypingType } from './constants';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export const publicTypeLabels: Record<TypingType, string> = {
  [TypingType.ABI]: 'ABIs',
  [TypingType.ETHERS_V6]: 'ethers.js types',
  [TypingType.WEB3_V1]: 'web3 types',
  [TypingType.CONTRACTS]: 'ABIs and contracts',
};
