import fs from 'fs';

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
