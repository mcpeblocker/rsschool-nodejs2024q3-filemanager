async function compress(ctx) {}

async function decompress(ctx) {}

export default [
  {
    // compress ___ ___ - compress file into archive
    matches: (command) => command.startsWith("compress "),
    execute: compress,
  },
  {
    // decomperss ___ ___ - decomperss file from archive to file
    matches: (command) => command.startsWith("decompress "),
    execute: decompress,
  },
];
