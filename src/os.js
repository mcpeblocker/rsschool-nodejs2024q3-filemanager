import os from "node:os";
import errors from "./errors.js";

/**
 * os --EOL
 * Get EOL (default system End-Of-Line) and print it to console
 */
async function eol() {
  console.log("Below is the EOL marker for your OS:");
  console.log(os.EOL);
  console.log("Above is the EOL marker for your OS:");
}

/**
 * os --cpus
 * Get host machine CPUs info
 * (overall amount of CPUS plus model and
 * clock rate (in GHz) for each of them) and
 * print it to console
 */
async function cpus() {
  const data = os.cpus();
  console.log("Number of logical CPU cores in your system: " + data.length);
  const content = data.map((item) => ({
    Model: item.model,
    "Clock Rate (GHz)": item.speed / 1000,
  }));
  console.table(content);
}

/**
 * os --homedir
 * Get home directory and print it to console
 */
async function homedir() {
  console.log(os.homedir());
}

/**
 * os --username
 * Get current system user name
 * (Do not confuse with the username that is set when the application starts)
 * and print it to console
 */
async function username() {
  try {
    console.log(os.userInfo().username);
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

/**
 * os --architecture
 * Get CPU architecture for which Node.js binary has compiled and print it to console
 */
async function architecture() {
  console.log(os.arch());
}

export default [
  {
    matches: (command) => command === "os --EOL",
    execute: eol,
  },
  {
    matches: (command) => command === "os --cpus",
    execute: cpus,
  },
  {
    matches: (command) => command === "os --homedir",
    execute: homedir,
  },
  {
    matches: (command) => command === "os --username",
    execute: username,
  },
  {
    matches: (command) => command === "os --architecture",
    execute: architecture,
  },
];
