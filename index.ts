import { resolvePaths, resolveConfig } from './src/config';

// * utils
import { pathsExist } from './src/utils';

const init = () => {
  const config = resolveConfig();
  const { inputs, outputs } = resolvePaths(config);

  const { ok, nonExistentPaths } = pathsExist(...inputs);

  if (!ok) {
    throw new Error(
      [
        'input svg files do not match the configuration',
        nonExistentPaths.map(path => path + " - doesn't exist").join('\r\n'),
      ].join('\r\n')
    );
  }
};

init();
