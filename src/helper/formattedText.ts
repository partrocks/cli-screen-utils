import color from "picocolors";
import { Dimensions } from "../screen";

export const bold = (text: string): string => {
  return color.bold(text);
};

export const italic = (text: string): string => {
  return color.italic(text);
};

export const underline = (text: string): string => {
  return color.underline(text);
};

export const strikethrough = (text: string): string => {
  return color.strikethrough(text);
};

export const dim = (text: string): string => {
  return color.dim(text);
};

export const hidden = (text: string): string => {
  return color.hidden(text);
};

export const white = (text: string): string => {
  return color.white(text);
};
export const black = (text: string): string => {
  return color.black(text);
};
export const yellow = (text: string): string => {
  return color.yellow(text);
};
export const red = (text: string): string => {
  return color.red(text);
};
export const green = (text: string): string => {
  return color.green(text);
};
export const blue = (text: string): string => {
  return color.blue(text);
};
export const cyan = (text: string): string => {
  return color.cyan(text);
};
export const magenta = (text: string): string => {
  return color.magenta(text);
};

export const success = (text: string): string => {
  return color.bgGreen(color.black(text));
};

export const error = (text: string): string => {
  return color.bgRed(color.white(text));
};

export const greenBar = (text: string): string => {
  return color.bgGreen(color.white(text));
};

export const warning = (text: string): string => {
  return color.bgYellow(color.black(text));
};

export const info = (text: string): string => {
  return color.bgMagenta(color.black(text));
};

export const title = (text: string): string => {
  return color.bgYellow(color.blackBright(text));
};

export const highlight = (text: string): string => {
  return color.bgBlue(color.white(text));
};

export const disabled = (text: string): string => {
  return color.reset(color.gray(text));
};

export const tabBtn = (text: string, isActive: boolean = false): string => {
  const padWidth = 10;
  return isActive
    ? highlight(padded(bold(text), padWidth, " "))
    : padded(text, padWidth, " ");
};

export const header = (text: string, dimensions: Dimensions): string => {
  const bar = "─".repeat(dimensions.width - 2);
  const padLen = Math.floor((dimensions.width - text.length) / 2) - 1;

  return title(`┌${bar}┐\n│${padded(text, padLen)}│\n└${bar}┘`);
};

export const fullWidth = (
  text: string,
  dimensions: Dimensions,
  centered: boolean = true
): string => {
  return !centered
    ? text.padStart(dimensions.width / 2).padEnd(dimensions.width / 2)
    : text.padEnd(dimensions.width);
};

export const notify = (text: string): string => {
  return highlight(padded(text, 5));
};

export const padded = (
  text: string,
  length: number = 2,
  padChar: string = " "
): string => {
  const padding = padChar.repeat(length);
  return `${padding}${text}${padding}`;
};
