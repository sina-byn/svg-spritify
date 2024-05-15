export const sortBreakpoints = (breakpoints: Record<string, number>) => {
  return Object.entries(breakpoints)
    .sort((a, b) => a[1] - b[1])
    .map(bp => bp[0]);
};
