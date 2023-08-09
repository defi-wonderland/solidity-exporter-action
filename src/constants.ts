/* eslint-disable prettier/prettier */
export const ethersDependencies = {
  '@ethersproject/abi': '5.7.0',
  '@ethersproject/providers': '5.7.2',
  'bn.js': '5.2.1',
  ethers: '6.0.3',
};

export const web3Dependencies = {
  'bn.js': '5.2.1',
  'web3-core': '1.9.0',
};

export enum PublishType {
  ABI = 'abi',
  ETHERS_V6 = 'ethers-v6',
  WEB3_V1 = 'web3-v1',
}
