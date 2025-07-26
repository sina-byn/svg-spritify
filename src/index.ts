#!/usr/bin/env node

import fs from 'fs';
import mixer from 'svg-mixer';

import { program } from 'commander';

// * utils
import { generateTsType, hasMultipleSVGs, normalizeColors } from './utils';

// * constants
const CWD = process.cwd();
const CLASS_NAME = 'icon';
const FILE_NAME = 'icons.svg';
const TS_FILE_NAME = 'icon.ts';

program.name('svg-spritify').description('SVG sprite generator CLI tool');

program.option('-i, --input <string>', 'entry point of the program', CWD);
program.option('--no-recursive', "don't search for SVGs recursively", true);

type Options = { input: string; recursive: boolean };

program.action(async (options: Options) => {
  const { input, recursive } = options;
  const PATTERNS = [recursive ? '**/*.svg' : '*.svg', '!**/node_modules/**', `!${FILE_NAME}`];

  process.chdir(input);

  const sprite = await mixer(PATTERNS, {
    prettify: true,
    spriteType: 'stack',
    // @ts-ignore
    spriteConfig: {
      usageClassName: CLASS_NAME,
      styles: `.${CLASS_NAME}{display:none;}.${CLASS_NAME}:target{display:inline;}`,
    },
  });

  if (!hasMultipleSVGs(sprite.content)) throw new Error('Could not find any SVG files');

  const svg = normalizeColors(sprite.content);
  const TsType = generateTsType(svg);

  fs.writeFileSync(FILE_NAME, svg, 'utf-8');
  fs.writeFileSync(TS_FILE_NAME, TsType, 'utf-8');

  process.chdir(CWD);
});

program.parse(process.argv);
