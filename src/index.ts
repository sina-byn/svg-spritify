import fs from 'fs';
import mixer from 'svg-mixer';

// * utils
import { extractIDs, normalizeColors } from './utils';

// * constants
const CLASS_NAME = 'icon';
const FILE_NAME = 'icons.svg';

const PATTERNS = ['**/*.svg', '!**/node_modules/**', `!${FILE_NAME}`];

const main = async () => {
  const sprite = await mixer(PATTERNS, {
    prettify: true,
    spriteType: 'stack',
    // @ts-ignore
    spriteConfig: { usageClassName: CLASS_NAME },
  });

  const svg = normalizeColors(sprite.content);

  const IDs = extractIDs(svg);

  console.log(IDs);

  fs.writeFileSync(FILE_NAME, svg, 'utf-8');
};

main();
