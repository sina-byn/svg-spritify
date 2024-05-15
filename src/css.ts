export const generatePreflight = (className: string) => {
  return `.${className}{display:none;}.${className}:target{display:inline;}`;
};

export const sortBreakpoints = (breakpoints: Record<string, number>) => {
  return Object.entries(breakpoints)
    .sort((a, b) => a[1] - b[1])
    .map(bp => bp[0]);
};

export const generateMediaQuery = (px: number, css: string, max: boolean = false) => {
  const type: 'min' | 'max' = max ? 'max' : 'min';

  return `@media (${type}-width: ${px}px){${css}}`;
};
