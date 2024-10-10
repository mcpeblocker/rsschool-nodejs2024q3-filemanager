function compress() {}

function decompress() {}

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
