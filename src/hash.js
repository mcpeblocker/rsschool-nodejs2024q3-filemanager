function hash(options) {}

export default [
  {
    // hash ___ - hash for file
    matches: (command) => command.startsWith("hash "),
    execute: hash,
  },
];
