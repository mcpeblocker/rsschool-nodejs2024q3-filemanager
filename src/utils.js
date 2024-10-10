import path from "node:path";
import os from "node:os";
import fsPromises from "node:fs/promises";

// Utilities
export const rootDir = path.parse(os.homedir()).root;

export const isPathDir = async (p) =>
  await fsPromises
    .stat(p)
    .then((stats) => stats.isDirectory())
    .catch(() => false);

export const getDirentType = (dirent) => {
  if (dirent.isDirectory()) return "directory";
  if (dirent.isFile()) return "file";
  return null;
};
