import path from 'path';
import Joi from 'joi';
import fs from 'fs';

// * data
const defaultConfig: Partial<SpriteConfig> = {
  filename: 'sprite',
  media: 'min',
  themes: ['light'],
  breakpoints: {},
};

// * schemas
const configSchema = Joi.object({
  filename: Joi.string().min(1),
  className: Joi.string(),
  media: Joi.string().valid('min', 'max'),
  themes: Joi.array().items(Joi.string().min(0)).min(1),
  breakpoints: Joi.object().pattern(Joi.string(), Joi.number().required()),
});

// * types
type SpriteConfig = {
  filename: string;
  className: string;
  media: 'min' | 'max';
  themes: string[];
  breakpoints: Record<string, number>;
};

export const resolvePaths = (config: SpriteConfig) => {
  const { filename, themes, breakpoints } = config;

  const breakpointNames = ['DEFAULT', ...Object.keys(breakpoints)];
  const multiBreakpoint = Object.values(breakpoints).filter(Boolean).length > 1;
  const multiTheme = themes.length > 1;

  if (multiTheme && multiBreakpoint) {
    return {
      inputs: themes.flatMap(theme => {
        return breakpointNames.map(bp => path.join('icons', theme, bp));
      }),
      outputs: themes.flatMap(theme => {
        theme = theme === 'light' ? '' : `-${theme}`;

        return breakpointNames.map(bp => {
          bp = bp === 'DEFAULT' ? '' : `-${bp}`;
          return filename + theme + bp + '.svg';
        });
      }),
    };
  }

  if (multiTheme) {
    return {
      inputs: themes.map(theme => path.join('icons', theme)),
      outputs: themes.map(theme => filename + (theme === 'light' ? '' : `-${theme}`) + '.svg'),
    };
  }

  if (multiBreakpoint) {
    return {
      inputs: breakpointNames.map(bp => path.join('icons', bp)),
      outputs: breakpointNames.map(bp => filename + (bp === 'DEFAULT' ? '' : `-${bp}`) + '.svg'),
    };
  }

  return { inputs: ['icons'], outputs: [`${filename}.svg`] };
};

export const resolveConfig = () => {
  const configPath = path.join(__dirname, '..', 'sprite.config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error('failed to resolve config - config file not found');
  }

  let config: SpriteConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  const { error } = configSchema.validate(config, { abortEarly: true });
  if (error) throw new Error(error.details[0].message);

  config = { ...defaultConfig, ...config };

  console.log(config);

  return config;
};

console.log(resolvePaths(resolveConfig()));
