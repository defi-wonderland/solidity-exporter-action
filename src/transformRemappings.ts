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

      if (remapping) {
        const remappingOrigin = remapping[0];
        const remappingDestination = remapping[1];
        line = line.replace(remappingOrigin, remappingDestination);
      }

      line = line.replace(/(['""]).*node_modules\//, `$1`);

      return line;
    })
    .join('\n');
};
