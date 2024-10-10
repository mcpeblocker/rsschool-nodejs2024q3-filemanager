function cat(options) {}

function add(options) {}

function rn(options) {}

function cp(options) {}

function mv(options) {}

function rm(options) {}

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
