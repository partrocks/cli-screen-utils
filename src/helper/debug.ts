export const debug = (
  message: string | object | null | undefined | unknown,
  exit: boolean = true
): void => {
  if (typeof message === "object") {
    message = JSON.stringify(message, null, 2);
  }

  if (typeof message === "undefined") {
    message = "[undefined]";
  }

  if (message === null) {
    message = "[null]";
  }

  process.stdout.write(`\n[DEBUG]: ${message}\n\n`);

  if (exit) {
    process.exit(0);
  }
};
