import path from "node:path";
import os from "node:os";
import fsPromises from "node:fs/promises";
import errors from "./errors.js";

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

export const extractMetadata = (command, prefix = "") => {
  const metadata = command.slice(prefix.length);
  if (!metadata || typeof metadata !== "string") throw errors.INVALID_INPUT;
  return metadata.trim();
};

export const extractTwoArgs = (metadata) => {
  const args = metadata.split(" "); // must have 2 arguments
  if (args.length !== 2) throw errors.INVALID_INPUT;
  return args;
};
