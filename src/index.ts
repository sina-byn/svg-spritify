#!/usr/bin/env node

import fs from 'fs';
import mixer from 'svg-mixer';

// * utils
import { generateTsType, normalizeColors } from './utils';

// * constants
const CLASS_NAME = 'icon';
const FILE_NAME = 'icons.svg';
const TS_FILE_NAME = 'icon.ts';

const PATTERNS = ['**/*.svg', '!**/node_modules/**', `!${FILE_NAME}`];

const main = async () => {
  const sprite = await mixer(PATTERNS, {
    prettify: true,
    spriteType: 'stack',
    // @ts-ignore
    spriteConfig: {
      usageClassName: CLASS_NAME,
      styles: `.${CLASS_NAME}{display:none;}.${CLASS_NAME}:target{display:inline;}`,
    },
  });

  const svg = normalizeColors(sprite.content);
  const TsType = generateTsType(svg);

  fs.writeFileSync(FILE_NAME, svg, 'utf-8');
  fs.writeFileSync(TS_FILE_NAME, TsType, 'utf-8');
};

main();
