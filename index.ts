import { resolvePaths, resolveConfig } from './src/config';
import logger from './src/logger';

// * utils
import { pathsExist } from './src/utils';

const init = () => {
  const config = resolveConfig();
  const { inputs, outputs } = resolvePaths(config);

  const { ok, nonExistentPaths } = pathsExist(...inputs);

  if (!ok) {
    throw new Error(
      logger.error(
        [
          "input svg files don't match the configuration",
          logger.warn(nonExistentPaths.map(path => path + " - doesn't exist").join('\r\n')),
        ].join('\r\n')
      )
    );
  }
};

init();
