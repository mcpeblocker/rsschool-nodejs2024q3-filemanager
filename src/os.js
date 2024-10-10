function eol(ctx) {}

function cpus(ctx) {}

function homedir(ctx) {}

function username(ctx) {}

function architecture(ctx) {}

export default [
  {
    // os --EOL - get EOL
    matches: (command) => command === "os --EOL",
    execute: eol,
  },
  {
    // os --cpus - get cpu info
    matches: (command) => command === "os --cpus",
    execute: eol,
  },
  {
    // os --homedir - get home dir
    matches: (command) => command === "os --homedir",
    execute: eol,
  },
  {
    // os --username - get system user name
    matches: (command) => command === "os --username",
    execute: eol,
  },
  {
    // os --architecture - get cpu architecture
    matches: (command) => command === "os --architecture",
    execute: eol,
  },
];
