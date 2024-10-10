async function hash(ctx) {}

export default [
  {
    // hash ___ - hash for file
    matches: (command) => command.startsWith("hash "),
    execute: hash,
  },
];
