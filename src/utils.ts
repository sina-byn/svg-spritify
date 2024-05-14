import fs from 'fs';

// * types
export type Dimensions = [number, number];

export const pathsExist = (...paths: string[]) => {
  const nonExistentPaths: string[] = [];
  let ok: boolean = true;

  for (const path of paths) {
    if (fs.existsSync(path)) continue;

    nonExistentPaths.push(path);
    ok = false;
  }

  return { ok, nonExistentPaths };
};

export const extractAttr = <T>(
  attr: string,
  svg: string,
  parseFn: (v: string) => T = v => v as T
) => {
  const attrRegex = new RegExp(`<svg \s*.*${attr}="([^"]+)".*\s*>`, 'gi');
  const values: T[] = [];
  let match;

  // compare the list of both arrays ids and viewboxes and show proper errors
  // find a way to check for the case that not all themes have the same number of icons
  // inform the user about this and make them fix it before retry

  while ((match = attrRegex.exec(svg))) values.push(parseFn(match[1]));

  return values;
};

export const parseViewBox = (viewBox: string): Dimensions => {
  const [x1, y1, x2, y2] = viewBox.split(/\s+/).map(parseFloat);

  return [x2 - x1, y2 - y1];
};
