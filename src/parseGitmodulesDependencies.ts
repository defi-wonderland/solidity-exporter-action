import { chunk } from 'lodash';
import fse from 'fs-extra';

export const parseGitmodulesDependencies = (): { [key: string]: string } => {
  let iniAsStr;
  try {
    iniAsStr = fse.readFileSync('./.gitmodules', { encoding: 'utf8' });
  } catch {
    return {};
  }
  const matches = [...iniAsStr.matchAll(/(?:path|url) = (.*)/g)].map(regexMatch => regexMatch[1]);
  if (matches.length == 0) return {};

  // this assumes .gitmodules to be well formed, same amount of paths and urls
  const dependencyPairs = chunk(matches, 2);

  // and path is always before url
  const dependencyObject = dependencyPairs.reduce<{ [key: string]: string }>((acc, curr) => {
    acc[curr[0].replace('lib/', '')] = curr[1];
    return acc;
  }, {});
  return dependencyObject;
};
