import path from "node:path";
import fsPromises from "node:fs/promises";
import errors from "./errors.js";
import * as utils from "./utils.js";

// up - go up from current directory
async function up(ctx) {
  if (ctx.currentPath === utils.rootDir) return;
  try {
    const newPath = path.resolve(ctx.currentPath, "../");
    return { currentPath: newPath };
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

// cd ___ - go to directory
async function cd(ctx) {
  // Metadata extraction
  const prefix = "cd ";
  const metadata = ctx.command.slice(prefix.length);
  if (!metadata || typeof metadata !== "string") throw errors.INVALID_INPUT;
  // cd operation
  try {
    const cdPath = path.resolve(ctx.currentPath, metadata);
    const isValid = await utils.isPathDir(cdPath);
    if (!isValid) throw errors.OPERATION_FAILED;
    return { currentPath: cdPath };
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

// ls - list dir
async function ls(ctx) {
  try {
    const dirents = await fsPromises.readdir(ctx.currentPath, {
      withFileTypes: true,
    });
    const content = dirents
      .reduce((acc, dirent) => {
        const info = {
          Name: dirent.name,
          Type: utils.getDirentType(dirent),
        };
        return info.Type === null ? acc : [...acc, info];
      }, [])
      .sort((a, b) => {
        const rankA = a.Type === "directory" ? 1 : 2;
        const rankB = b.Type === "directory" ? 1 : 2;
        if (rankA === rankB) {
          // in case of entities with the same type, sort alphabetically
          return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1;
        }
        return rankA - rankB;
      });
    console.table(content);
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
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
