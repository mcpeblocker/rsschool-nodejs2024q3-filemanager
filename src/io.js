import * as readline from "node:readline/promises";
import process from "node:process";

export function getRlInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}
