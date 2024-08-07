import { sync as pkgDir } from 'pkg-dir';
import path from 'path';
import Joi from 'joi';
import fs from 'fs';

import { sortBreakpoints } from './css';

// * data
const defaultConfig: Partial<SpriteConfig> = {
  outDir: '.output',
  rootDir: 'icons',
  filename: 'sprite',
  className: 'sprite',
  media: 'min',
  themes: ['light'],
  breakpoints: {},
  breakpointUtils: true,
  demo: false,
  typescript: true,
  css: {
    minify: false,
    filename: 'sprite',
  },
};

// * schemas
const configSchema = Joi.object({
  outDir: Joi.string().min(1),
  rootDir: Joi.string().min(1),
  filename: Joi.string().min(1),
  tag: Joi.string().min(1),
  className: Joi.string().min(1),
  media: Joi.string().valid('min', 'max'),
  defaultTheme: Joi.string().min(1),
  themes: Joi.array().items(Joi.string().min(0)).min(1),
  breakpoints: Joi.object().pattern(Joi.string().invalid('DEFAULT'), Joi.number().required()),
  breakpointUtils: Joi.boolean(),
  typescript: Joi.alternatives(
    Joi.boolean(),
    Joi.object({
      filename: Joi.string().min(1),
      typeName: Joi.string()
        .min(1)
        .regex(/\s+|^\d+/, { invert: true })
        .messages({
          'string.pattern.invert.base':
            'invalid typeName - spaces are not allowed and typeName should not start with a digit',
        }),
    })
  ),
  demo: Joi.alternatives(
    Joi.boolean(),
    Joi.object().pattern(Joi.string(), Joi.string().hex().max(6))
  ),
  css: Joi.object({
    minify: Joi.boolean(),
    filename: Joi.string().min(1),
  }),
});

// * types
type DemoConfig = boolean | Record<string, string>;

type TypescriptConfig = boolean | { typeName?: string; filename?: string };

type CSSConfig = {
  minify?: boolean;
  filename?: string;
};

export type SpriteConfig = {
  tag?: string;
  css: CSSConfig;
  outDir: string;
  rootDir: string;
  filename: string;
  className: string;
  media: 'min' | 'max';
  themes: string[];
  defaultTheme: string;
  breakpoints: Record<string, number>;
  breakpointUtils: boolean;
  demo: DemoConfig;
  typescript: TypescriptConfig;
};

export const resolvePaths = (config: SpriteConfig) => {
  const { tag, media, rootDir, filename, themes, breakpoints, defaultTheme } = config;

  const breakpointNames = ['DEFAULT', ...sortBreakpoints(breakpoints, media === 'max')];
  const multiBreakpoint = Object.values(breakpoints).filter(Boolean).length > 0;
  const multiTheme = themes.length > 1;

  if (multiTheme && multiBreakpoint) {
    return {
      inputs: themes.flatMap(theme => {
        return breakpointNames.map(bp => path.join(rootDir, theme, bp));
      }),
      outputs: themes.flatMap(theme => {
        theme = theme === defaultTheme ? '' : `-${theme}`;

        return breakpointNames.map(bp => {
          bp = bp === 'DEFAULT' ? '' : `-${bp}`;
          return filename + theme + bp + '.svg';
        });
      }),
    };
  }

  if (multiTheme) {
    return {
      inputs: themes.map(theme => path.join(rootDir, theme)),
      outputs: themes.map(theme => filename + (theme === defaultTheme ? '' : `-${theme}`) + '.svg'),
    };
  }

  if (multiBreakpoint) {
    return {
      inputs: breakpointNames.map(bp => path.join(rootDir, bp)),
      outputs: breakpointNames.map(bp => filename + (bp === 'DEFAULT' ? '' : `-${bp}`) + '.svg'),
    };
  }

  return { inputs: [rootDir], outputs: [`${filename}.svg`] };
};

export const resolveConfig = () => {
  const configPath = path.join(pkgDir() ?? process.cwd(), 'sprite.config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error('failed to resolve config - config file not found');
  }

  let config: SpriteConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  const { error } = configSchema.validate(config, { abortEarly: true });
  if (error) throw new Error(error.details[0].message);

  config = {
    ...defaultConfig,
    ...config,
    css: { ...defaultConfig.css, ...config.css },
  };

  if (!config.defaultTheme) config.defaultTheme = config.themes[0];

  if (config.themes[0] !== config.defaultTheme) {
    config.themes.unshift(config.defaultTheme);
    config.themes = [...new Set(config.themes)];
  }

  if (!fs.existsSync(config.outDir)) fs.mkdirSync(config.outDir, { recursive: true });

  if (!fs.existsSync(config.rootDir)) {
    throw new Error("invalid config provided - rootDir doesn't exist");
  }

  return config;
};

// console.log(resolvePaths(resolveConfig()));
