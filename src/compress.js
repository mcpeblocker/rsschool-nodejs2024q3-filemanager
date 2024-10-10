import zlib from "node:zlib";
import stream from "node:stream/promises";
import fs from "node:fs";
import path from "node:path";
import * as utils from "./utils.js";
import errors from "./errors.js";

/**
 * compress path_to_file path_to_destination
 * Compress file (using Brotli algorithm, should be done using Streams API)
 */
async function compress(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "compress ");
  const [source, destination] = utils
    .extractTwoArgs(metadata)
    .map((p) => path.resolve(ctx.currentPath, p));
  try {
    const zipper = zlib.createBrotliCompress();
    await stream.pipeline(
      fs.createReadStream(source),
      zipper,
      fs.createWriteStream(destination)
    );
    console.log("Compress complete");
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * decompress path_to_file path_to_destination
 * Decompress file (using Brotli algorithm, should be done using Streams API)
 * NB! After decompressing of previously compressed file result should not differ with originally compressed file
 */
async function decompress(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "decompress ");
  const [source, destination] = utils
    .extractTwoArgs(metadata)
    .map((p) => path.resolve(ctx.currentPath, p));
  try {
    const unzip = zlib.createBrotliDecompress();
    await stream.pipeline(
      fs.createReadStream(source),
      unzip,
      fs.createWriteStream(destination)
    );
    console.log("Uncompress complete");
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

export default [
  {
    matches: (command) => command.startsWith("compress "),
    execute: compress,
  },
  {
    matches: (command) => command.startsWith("decompress "),
    execute: decompress,
  },
];
