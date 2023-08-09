import { PublishType } from './constants';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export const publicTypeLabels: Record<PublishType, string> = {
  [PublishType.ABI]: 'ABI',
  [PublishType.ETHERS_V6]: 'Ethers.js',
  [PublishType.WEB3_V1]: 'Web3',
};
