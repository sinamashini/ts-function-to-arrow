import path from "path";

export const resolveProjectRoot = (): string => {
  return process.cwd();
};

export const getRelativePath = (fullPath: string): string => {
  return path.relative(resolveProjectRoot(), fullPath);
};
