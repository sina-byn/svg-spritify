import cssBeautify from 'cssbeautify';
import mixer from 'svg-mixer';
import path from 'path';
import fs from 'fs';

import { generateMediaQuery, generateBreakpointUtils } from './src/css';
import { resolvePaths, resolveConfig } from './src/config';
import generateDemo from './src/demo';
import logger from './src/logger';

// * utils
import { pathsExist, extractAttr, parseViewBox, type Dimensions } from './src/utils';

const init = async () => {
  const config = resolveConfig();
  const { inputs, outputs } = resolvePaths(config);
  const { ok, nonExistentPaths } = pathsExist(...inputs);
  const { className, defaultTheme } = config;
  const uniqueIds = new Set<string>();

  let css = `.${className}{display:inline-block;}`;

  if (config.breakpointUtils) css += generateBreakpointUtils(config);

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
      spriteConfig: {
        usageClassName: config.className,
        styles: `.${className}{display:none;}.${className}:target{display:inline;}`,
      },
      spriteType: 'stack',
      prettify: true,
    });

    const dimensions = extractAttr<Dimensions>('viewBox', sprite, parseViewBox);
    const ids = extractAttr<string>('id', sprite);

    if (config.demo) ids.forEach(id => uniqueIds.add(id));

    console.log(dimensions);
    console.log(ids);

    const [theme = defaultTheme, breakpoint = 'DEFAULT'] = input
      .replace('icons', '')
      .split(path.sep)
      .filter(Boolean);

    fs.writeFileSync(path.join(config.outDir, output), sprite, 'utf-8');

    const themeSelector = theme === defaultTheme ? '' : `.${theme} `;

    const spriteCSS = ids.reduce((css, id, index) => {
      const [width, height] = dimensions[index];
      const dimensionsCSS = theme === defaultTheme ? `width:${width}px;height:${height}px;` : '';

      css += `${themeSelector}.${id}{${dimensionsCSS}background-image: url('${output}#${id}');}`;

      return css;
    }, '');

    css +=
      breakpoint !== 'DEFAULT'
        ? generateMediaQuery(config.breakpoints[breakpoint], spriteCSS, config.media === 'max')
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
