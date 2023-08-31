import { TypingType } from './constants';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export const publicTypeLabels: Record<TypingType, string> = {
  [TypingType.ABI]: 'ABI',
  [TypingType.ETHERS_V6]: 'Ethers.js',
  [TypingType.WEB3_V1]: 'Web3',
  [TypingType.CONTRACTS]: 'Contracts', // Contracts, abis and interfaces
};
