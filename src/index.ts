import fs from 'fs';

import mixer from 'svg-mixer';

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

  const svg = sprite.content;

  fs.writeFileSync(FILE_NAME, svg, 'utf-8');
};

main();
