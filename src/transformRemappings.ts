import fse from 'fs-extra';

export const transformRemappings = (file: string): string => {
  const fileLines = file.split('\n');

  // Initialize remappings array to an empty array
  let remappings: [string, string][] = [];

  try {
    if (fse.existsSync('remappings.txt')) {
      // Attempt to read the remappings file
      const remappingsContent = fse.readFileSync('remappings.txt', 'utf8');

      // Parse the content and filter empty lines
      remappings = remappingsContent
        .split('\n')
        .filter(Boolean)
        .map(line => line.trim().split('=') as [string, string]);
    } else {
      return '';
    }
  } catch (error) {
    // Handle the error when the file does not exist or cannot be read
    console.error('Error reading remappings file:', error);
  }

  return fileLines
    .map(line => {
      // Just modify imports
      if (!line.match(/^\s*import /i)) return line;

      const remapping = remappings.find(([find]) => line.match(find));

      if (!remapping) {
        // Transform:
        // import '../../../node_modules/some-file.sol';
        // into:
        // import 'some-file.sol';
        const modulesKey = 'node_modules/';

        if (line.includes(modulesKey)) {
          line = `import '` + line.substring(line.indexOf(modulesKey) + modulesKey.length);
        } else {
          return line;
        }

        return line;
      }

      const remappingOrigin = remapping[0];
      const remappingDestination = remapping[1];

      const dependencyDirectory = line.replace(remappingOrigin, remappingDestination);

      line = `import '` + dependencyDirectory;

      return line;
    })
    .join('\n');
};
