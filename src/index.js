import process from "node:process";
import os from "node:os";
import { parseCliArgs, getRlInterface } from "./cli.js";
import errors from "./errors.js";
import navigationHandlers from "./navigation.js";
import fileHandlers from "./file.js";
import osHandlers from "./os.js";
import hashHandlers from "./hash.js";
import compressHandlers from "./compress.js";

const input = getRlInterface();
const args = parseCliArgs();
const handlers = [
  {
    matches: (command) => command === ".exit",
    execute: () => process.emit("SIGINT"),
  },
  ...navigationHandlers,
  ...fileHandlers,
  ...osHandlers,
  ...hashHandlers,
  ...compressHandlers,
];

async function main() {
  // Register even listeners
  process.on("SIGINT", function () {
    console.log(
      `\nThank you for using File Manager, ${args.username}, goodbye!`
    );
    input.close();
    process.exit();
  });
  // Need to emit SIGINT event manually after connecting stdin to readline interface
  input.on("SIGINT", () => {
    process.emit("SIGINT");
  });

  // Main controlling procedure
  const initialCtx = {
    currentPath: os.homedir(),
  };
  let ctx = initialCtx;

  console.log(`Welcome to the File Manager, ${args.username}!`);
  while (true) {
    const command = await input.question(
      `~ You are currently in ${ctx.currentPath}\n$ `
    );
    try {
      // get the appropriate handler for the given command
      const handler = handlers.find(({ matches }) => matches(command));
      if (!handler) throw errors.INVALID_INPUT;
      const newCtx = await handler.execute({ ...ctx, command });
      // update ctx (context)
      if (newCtx) {
        for (const key in newCtx) {
          ctx[key] = newCtx[key];
        }
      }
    } catch (error) {
      if (error === errors.INVALID_INPUT || error === errors.OPERATION_FAILED) {
        console.error(error.message);
      } else {
        /** 
         * REMOVE BEFORE SUBMISSION!!!
         */
        console.error("UNHANDLED ERROR!");
        console.log(error);
        process.exit(1);
      }
    }
  }
}

await main();
