import os from "node:os";
import errors from "./errors.js";

// os --EOL - get EOL
async function eol() {
  console.log("Below is the EOL marker for your OS:");
  console.log(os.EOL);
  console.log("Above is the EOL marker for your OS:");
}

// os --cpus - get cpu info
async function cpus() {
  const data = os.cpus();
  console.log("Number of logical CPU cores in your system: " + data.length);
  const content = data.map((item) => ({
    Model: item.model,
    "Clock Rate (GHz)": item.speed / 1000,
  }));
  console.table(content);
}

// os --homedir - get home dir
async function homedir() {
  console.log(os.homedir());
}

// os --username - get system user name
async function username() {
  try {
    console.log(os.userInfo().username);
  } catch (_) {
    throw errors.OPERATION_FAILED;
  }
}

// os --architecture - get cpu architecture
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
