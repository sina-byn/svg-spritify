export const normalizeColors = (svg: string) => {
  const re = /(fill|stroke)="\s*([^"]+)\s*"/g;

  return svg.replace(re, (_, attr, color) => {
    color = color !== 'none' ? 'currentColor' : 'none';
    return `${attr}="${color}"`;
  });
};

export const extractIDs = (svg: string) => {
  const re = /id="\s*([^"]+)\s*"/g;
  const IDs: string[] = [];

  let match: RegExpExecArray | null = null;

  while ((match = re.exec(svg))) IDs.push(match[1]);

  return IDs;
};
