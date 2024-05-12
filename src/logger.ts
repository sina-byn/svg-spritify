import chalk from 'chalk';

const logger = (...inputs: unknown[]) => chalk.reset(...inputs);

logger.success = (...inputs: unknown[]) => chalk.greenBright(...inputs);

logger.error = (...inputs: unknown[]) => chalk.redBright(...inputs);

logger.info = (...inputs: unknown[]) => chalk.blueBright(...inputs);

logger.warn = (...inputs: unknown[]) => chalk.yellowBright(...inputs);

export default logger;
