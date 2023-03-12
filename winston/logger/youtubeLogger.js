const { createLogger, transports, format, level } = require("winston");
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ message, level, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});

const youtubeLogger = () => {
  return createLogger({
    level: "debug",
    // format: winston.format.json(),
    format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), myFormat),
    // defaultMeta: { service: "youtube" },
    transports: [
      new transports.Console(),
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.File({ filename: "combined.log" }),
    ],
  });
};

module.exports = youtubeLogger;
