import process from "node:process";

const TEMPLATE_MESSAGE = "(e.g. in the format: --key1=value1 --key2=value2)";
const NO_PREFIX_ERROR = new Error(
  `Arguments must start with "--".\n${TEMPLATE_MESSAGE}`
);
const NO_EQUALITY_ERROR = new Error(
  `Arguments must include "=" symbol separating key and value.\n${TEMPLATE_MESSAGE}`
);
const NO_KEY_VALUE_ERROR = new Error(
  `Arguments must include non-empty key and value.\n${TEMPLATE_MESSAGE}`
);

export function parseCliArgs() {
  const args = {};
  try {
    for (let argString of process.argv.slice(2)) {
      const prefix = argString.slice(0, 2);
      if (prefix !== "--") {
        throw NO_PREFIX_ERROR;
      }
      const splitIndex = argString.indexOf("=");
      if (splitIndex < 0) {
        throw NO_EQUALITY_ERROR;
      }
      const key = argString.slice(2, splitIndex);
      const value = argString.slice(splitIndex + 1, argString.length);
      if (key === "" || value === "") {
        throw NO_KEY_VALUE_ERROR;
      }
      args[key] = value;
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  return args;
}
