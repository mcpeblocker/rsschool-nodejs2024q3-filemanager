import path from "node:path";
import crypto from "node:crypto";
import fsPromises from "node:fs/promises";
import errors from "./errors.js";
import * as utils from "./utils.js";

/**
 * hash path_to_file
 * Calculate hash for file and print it into console
 */
async function hash(ctx) {
  const metadata = utils.extractMetadata(ctx.command, "hash ");
  try {
    const filePath = path.resolve(ctx.currentPath, metadata);
    const content = await fsPromises.readFile(filePath, { encoding: "utf8" });
    const hash = crypto.createHash("sha256").update(content).digest("hex");
    console.log(hash);
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

export default [
  {
    matches: (command) => command.startsWith("hash "),
    execute: hash,
  },
];
