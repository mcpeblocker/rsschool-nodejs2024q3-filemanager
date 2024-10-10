async function cat(ctx) {}

async function add(ctx) {}

async function rn(ctx) {}

async function cp(ctx) {}

async function mv(ctx) {}

async function rm(ctx) {}

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
