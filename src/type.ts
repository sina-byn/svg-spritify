import fs from 'fs';
import path from 'path';

// * types
import type { SpriteConfig } from './config';

const generateType = (ids: string[], config: SpriteConfig) => {
  const tsConfig = config.typescript;
  let typeName = 'SpriteIcon';
  let filename = 'icons';

  if (typeof tsConfig === 'object') {
    typeName = tsConfig.typeName ?? typeName;
    filename = tsConfig.filename ?? filename;
  }

  const ts = `export type ${typeName} = \n${ids.map(id => `  | '${id}'`).join('\n')};`;

  fs.writeFileSync(path.join(config.outDir, `${filename}.ts`), ts, 'utf-8');
};

export default generateType;
