const colors = {
  reset: "\x1b[0m",
  info: "\x1b[34m", // Blue
  success: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  debug: "\x1b[35m", // Magenta
};

type LogLevel = "info" | "success" | "warn" | "error" | "debug";

/**
 * Logs messages with different colors using ANSI escape codes
 * @param level LogLevel
 * @param message string
 * @param args any[]
 */
export const logger = (
  level: LogLevel,
  message: string,
  ...args: any[]
): void => {
  const color = colors[level] || colors.info;
  const prefix = `[${level.toUpperCase()}]`;
  console.log(
    `${color}${new Date().toISOString()} - ${prefix} - ${message}${
      colors.reset
    }`,
    ...args
  );
};
