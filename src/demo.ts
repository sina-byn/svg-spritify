import fs from 'fs';
import path from 'path';

// * types
import type { SpriteConfig } from './config';

const generateDemo = (ids: string[], config: SpriteConfig) => {
  let template = fs.readFileSync(path.join(__dirname, 'assets', 'template.html'), 'utf-8');
  const demoConfig = config.demo;

  template = template.replace(
    /<!--\s*__themes__\s*-->/g,
    config.themes.map(theme => `<option value="${theme}">${theme}</option>`).join('')
  );

  template = template.replace(
    /<!--\s*__icons__\s*-->/g,
    ids.map(id => `<i class="${config.className} ${id}"></i>`).join('')
  );

  template = template.replace(
    /<!--\s*__stylesheet__\s*-->/,
    `<link rel="stylesheet" href="${config.css.filename}.css">`
  );

  if (typeof demoConfig === 'object') {
    template = template.replace(
      /\/\*\s*__themes-colors__ \s*\*\//g,
      Object.keys(demoConfig).reduce((themesColors, theme) => {
        const color = '#' + demoConfig[theme];

        themesColors += `.${theme}{--clr-theme:${color};}`;

        return themesColors;
      }, '')
    );
  }

  fs.writeFileSync(path.join(config.outDir, 'demo.html'), template, 'utf-8');
};

export default generateDemo;
