export const normalizeColors = (svg: string) => {
  const re = /(fill|stroke)="\s*([^"]+)\s*"/g;

  return svg.replace(re, (_, attr, color) => {
    color = color !== 'none' ? 'currentColor' : 'none';
    return `${attr}="${color}"`;
  });
};

export const hasMultipleSVGs = (svg: string) => {
  const re = /<svg[^>]+>/g;
  let count = 0;

  while (count < 3 && re.exec(svg) !== null) count++;

  return count > 1;
};

export const generateTsType = (svg: string) => {
  const IDs = extractIDs(svg).map(ID => `  | '${ID}'`);
  return `export type Icon =\n${IDs.join('\n')};`;
};

const extractIDs = (svg: string) => {
  const re = /id="\s*([^"]+)\s*"/g;
  const IDs: string[] = [];

  let match: RegExpExecArray | null = null;

  while ((match = re.exec(svg))) IDs.push(match[1]);

  return IDs;
};
