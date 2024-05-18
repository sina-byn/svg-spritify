// * types
import type { SpriteConfig } from './config';

export const generateBreakpointUtils = (config: SpriteConfig) => {
  const { media, className, breakpoints } = config;
  const shouldUseMaxMedia = media === 'max';
  const sortedBreakpoints = sortBreakpoints(breakpoints, shouldUseMaxMedia);

  return sortedBreakpoints.reduce((utilsCSS, breakpoint) => {
    const selector = `.${className}-${breakpoint}`;

    utilsCSS += `${selector}{display:none;}`;
    utilsCSS += generateMediaQuery(
      breakpoints[breakpoint],
      `${selector}{display:inline-block;}`,
      shouldUseMaxMedia
    );

    return utilsCSS;
  }, '');
};

export const sortBreakpoints = (breakpoints: Record<string, number>, max: boolean = false) => {
  return Object.entries(breakpoints)
    .sort((a, b) => (max ? b[1] - a[1] : a[1] - b[1]))
    .map(bp => bp[0]);
};

export const generateMediaQuery = (px: number, css: string, max: boolean = false) => {
  const type: 'min' | 'max' = max ? 'max' : 'min';

  return `@media (${type}-width: ${px}px){${css}}`;
};
