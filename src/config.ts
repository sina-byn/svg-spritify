import { sync as pkgDir } from 'pkg-dir';
import path from 'path';
import fs from 'fs';

// * types
type SpriteConfig = {};

export const resolveInputs = () => {};

export const resolveConfig = () => {
  const configPath = path.join(pkgDir() ?? process.cwd(), 'sprite.config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error('failed to resolve config - config file not found');
  }

  const config: SpriteConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  console.log(config);

  return config;
};
