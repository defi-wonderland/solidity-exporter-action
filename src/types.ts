import { TypingType } from './constants';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export const publicTypeLabels: Record<TypingType, string> = {
  [TypingType.ABI]: 'ABIs',
  [TypingType.CONTRACTS]: 'ABIs and contracts',
};
