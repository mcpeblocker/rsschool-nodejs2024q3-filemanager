import os from "node:os";
import path from "node:path";
import fsPromises from "node:fs/promises";
import errors from "./errors.js";

// Utilities
const rootDir = path.parse(os.homedir()).root;
const isDir = async (p) =>
  await fsPromises
    .stat(p)
    .then((stats) => stats.isDirectory())
    .catch(() => false);
function getDirentType(dirent) {
  if (dirent.isDirectory()) return "directory";
  if (dirent.isFile()) return "file";
  return null;
}

// up - go up from current directory
async function up(ctx) {
  if (ctx.currentPath === rootDir) return;
  const newPath = path.resolve(ctx.currentPath, "../");
  return { currentPath: newPath };
}

// cd ___ - go to directory
async function cd(ctx) {
  // Metadata extraction
  const prefix = "cd ";
  const metadata = ctx.command.slice(prefix.length);
  if (!metadata || typeof metadata !== "string") throw errors.INVALID_INPUT;
  // cd operation
  const cdPath = path.resolve(ctx.currentPath, metadata);
  const isValid = await isDir(cdPath);
  if (!isValid) throw errors.OPERATION_FAILED;
  return { currentPath: cdPath };
}

// ls - list dir
async function ls(ctx) {
  const dirents = await fsPromises.readdir(ctx.currentPath, {
    withFileTypes: true,
  });
  const contents = dirents
    .reduce((acc, dirent) => {
      const info = {
        Name: dirent.name,
        Type: getDirentType(dirent),
      };
      return info.Type === null ? acc : [...acc, info];
    }, [])
    .sort((a, b) => {
      const rankA = a.Type === "directory" ? 1 : 2;
      const rankB = b.Type === "directory" ? 1 : 2;
      if (rankA === rankB) {
        return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1;
      }
      return rankA - rankB;
    });
  console.table(contents);
}

export default [
  {
    matches: (command) => command === "up",
    execute: up,
  },
  {
    matches: (command) => command.startsWith("cd "),
    execute: cd,
  },
  {
    matches: (command) => command === "ls",
    execute: ls,
  },
];
