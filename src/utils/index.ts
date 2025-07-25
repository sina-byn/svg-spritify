export const normalizeColors = (svg: string) => {
  const re = /(fill|stroke)="\s*([^"]+)\s*"/g;

  return svg.replace(re, (_, attr, color) => {
    color = color !== 'none' ? 'currentColor' : 'none';
    return `${attr}="${color}"`;
  });
};
