import cssBeautify from 'cssbeautify';
import mixer from 'svg-mixer';
import path from 'path';
import fs from 'fs';

import { generatePreflight, generateMediaQuery } from './src/css';
import { resolvePaths, resolveConfig } from './src/config';
import logger from './src/logger';

// * utils
import { pathsExist, extractAttr, parseViewBox, type Dimensions } from './src/utils';
import generateDemo from './src/demo';

const init = async () => {
  const config = resolveConfig();
  const { inputs, outputs } = resolvePaths(config);
  const { ok, nonExistentPaths } = pathsExist(...inputs);
  const uniqueIds = new Set<string>();

  let css = generatePreflight(config.className);

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

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const output = outputs[i];

    const { content: sprite } = await mixer(path.join(input, '*.svg'), {
      // @ts-ignore
      spriteConfig: { usageClassName: config.className, styles: '' },
      spriteType: 'stack',
      prettify: true,
    });

    const dimensions = extractAttr<Dimensions>('viewBox', sprite, parseViewBox);
    const ids = extractAttr<string>('id', sprite);

    if (config.demo) ids.forEach(id => uniqueIds.add(id));

    console.log(dimensions);
    console.log(ids);

    const [theme = 'light', breakpoint = 'DEFAULT'] = input
      .replace('icons', '')
      .split(path.sep)
      .filter(Boolean);

    fs.writeFileSync(path.join(config.outDir, output), sprite, 'utf-8');

    const themeSelector = theme === 'light' ? '' : `.${theme} `;

    const spriteCSS = ids.reduce((css, id, index) => {
      const [width, height] = dimensions[index];

      css += `${themeSelector}.${id}{width:${width}px; height:${height}px;background-image: url('${output}#${id}');}`;

      return css;
    }, '');

    css +=
      breakpoint !== 'DEFAULT'
        ? generateMediaQuery(config.breakpoints[breakpoint], spriteCSS)
        : spriteCSS;
  }

  fs.writeFileSync(
    path.join(config.outDir, `${config.css.filename}.css`),
    config.css.minify ? css : cssBeautify(css, { indent: '  ' }),
    'utf-8'
  );

  if (config.demo) generateDemo([...uniqueIds], config);
};

init();
