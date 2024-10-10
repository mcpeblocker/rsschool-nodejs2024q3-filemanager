import zlib from "node:zlib";
import stream from "node:stream/promises";
import fs from "node:fs";
import path from "node:path";
import * as utils from "./utils.js";
import errors from "./errors.js";

// compress ___ ___ - compress file into archive
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

// decompress ___ ___ - decompress file from archive to file
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
