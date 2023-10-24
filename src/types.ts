import { ExportType } from './constants';

export interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export const publicTypeLabels: Record<ExportType, string> = {
  [ExportType.INTERFACES]: 'ABIs and interfaces',
  [ExportType.CONTRACTS]: 'ABIs, interfaces and contracts',
};
