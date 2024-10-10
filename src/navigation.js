import path from "node:path";
import fsPromises from "node:fs/promises";
import errors from "./errors.js";
import * as utils from "./utils.js";

/**
 * up
 * Go upper from current directory
 * (when you are in the root folder this operation shouldn't change working directory)
 */
async function up(ctx) {
  if (ctx.currentPath === utils.rootDir) return;
  try {
    const newPath = path.resolve(ctx.currentPath, "../");
    return { currentPath: newPath };
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * cd path_to_directory
 * Go to dedicated folder from current directory 
 * (path_to_directory can be relative or absolute)
 */
async function cd(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "cd ");
  try {
    const cdPath = path.resolve(ctx.currentPath, metadata);
    const isValid = await utils.isPathDir(cdPath);
    if (!isValid) throw errors.OPERATION_FAILED;
    return { currentPath: cdPath };
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * ls
 * Print in console list of all files and folders in current directory. 
 * List should contain:
 *  - list should contain files and folder names (for files - with extension)
 *  - folders and files are sorted in alphabetical order ascending, but list of folders goes first 
 *  - type of directory content should be marked explicitly (e.g. as a corresponding column value)
 */
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
