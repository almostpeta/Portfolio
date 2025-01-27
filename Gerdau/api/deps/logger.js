const pino = require("pino");
const { isPlainObject, pick } = require("lodash");

const errorSerielizer = (value) => {
  if (value instanceof Error) {
    if (typeof value.toJSON === "function") return value.toJSON();
    return pick(value, ["message", "stack"]);
  }
  return value;
};

module.exports = pino({
  hooks: {
    logMethod(inputArgs, method) {
      if (inputArgs.length >= 2 && isPlainObject(inputArgs[1])) {
        const arg1 = inputArgs.shift();
        let arg2 = inputArgs.shift();
        arg2 = { message: arg1, ...arg2 };
        inputArgs = [arg2, ...inputArgs];
      }

      return method.apply(this, inputArgs);
    },
  },
  formatters: {
    level: (label, level) => ({ level: label }),
  },
  serializers: {
    err: errorSerielizer,
    error: errorSerielizer,
  },
  base: null,
  messageKey: "message",
  level: process.env.DEBUG_LEVEL || "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
});
