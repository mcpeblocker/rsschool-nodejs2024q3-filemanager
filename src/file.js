import streamPromises from "node:stream/promises";
import fsPromises from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import errors from "./errors.js";
import * as utils from "./utils.js";

/**
 * cat path_to_file
 * Read file and print it's content in console
 * (should be done using Readable stream)
 */
async function cat(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "cat ");
  const filePath = path.resolve(ctx.currentPath, metadata);
  try {
    const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });
    fileStream.on("data", console.log);
    // wait until output is complete
    await streamPromises.finished(fileStream);
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * add new_file_name
 * Create empty file in current working directory
 */
async function add(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "add ");
  const filePath = path.resolve(ctx.currentPath, metadata);
  try {
    await fsPromises.appendFile(filePath, "");
    console.log("Add complete");
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * rn path_to_file new_filename
 * Rename file (content should remain unchanged)
 */
async function rn(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "rn ");
  const [source, destination] = utils
    .extractTwoArgs(metadata)
    .map((p) => path.resolve(ctx.currentPath, p));
  try {
    await fsPromises.rename(source, destination);
    console.log("Rename complete");
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * cp path_to_file path_to_new_directory
 * Copy file (should be done using Readable and Writable streams)
 */
async function cp(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "cp ");
  let [source, destination] = utils
    .extractTwoArgs(metadata)
    .map((p) => path.resolve(ctx.currentPath, p));
  destination = path.resolve(destination, path.basename(source));
  try {
    const sourceStream = fs.createReadStream(source);
    const destinationStream = fs.createWriteStream(destination);
    sourceStream.pipe(destinationStream);
    await streamPromises.finished(sourceStream);
    console.log("Copy complete");
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * mv path_to_file path_to_new_directory
 * Move file
 * (same as copy but initial file is deleted,
 * copying part should be done using Readable and Writable streams)
 */
async function mv(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "mv ");
  let [source, destination] = utils
    .extractTwoArgs(metadata)
    .map((p) => path.resolve(ctx.currentPath, p));
  destination = path.resolve(destination, path.basename(source));
  try {
    // copy to destination
    const sourceStream = fs.createReadStream(source);
    const destinationStream = fs.createWriteStream(destination);
    sourceStream.pipe(destinationStream);
    await streamPromises.finished(sourceStream);
    // remove source
    await fsPromises.rm(source, { recursive: true });
    console.log("Move complete");
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * rm path_to_file
 * Delete file:
 */
async function rm(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "rm ");
  const filePath = path.resolve(ctx.currentPath, metadata);
  try {
    await fsPromises.rm(filePath, { recursive: true });
    console.log("Remove complete");
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

export default [
  {
    matches: (command) => command.startsWith("cat "),
    execute: cat,
  },
  {
    matches: (command) => command.startsWith("add "),
    execute: add,
  },
  {
    matches: (command) => command.startsWith("rn "),
    execute: rn,
  },
  {
    matches: (command) => command.startsWith("cp "),
    execute: cp,
  },
  {
    matches: (command) => command.startsWith("mv "),
    execute: mv,
  },
  {
    matches: (command) => command.startsWith("rm "),
    execute: rm,
  },
];
