import { Dimensions } from "../screen";
import { white, dim } from "../helper/formattedText";
import { Outlet } from "./outlet";

export class ConsolePanel extends Outlet {
  private lines: string[] = [];
  private title: string;

  constructor(
    public name: string,
    _title?: string,
    private maxLines: number = 10
  ) {
    super(name, []);
    this.title = _title || name;
  }

  public addLine(line: string): void {
    this.lines.push(line);
    if (this.lines.length > this.maxLines) {
      this.lines.shift();
    }
  }

  public clear(): void {
    this.lines = [];
  }

  public render(): string[] {
    const output: string[] = [];

    const borderWidth = 2;

    const availableHeight = this.dimensions.height;
    const visibleLines = this.lines.slice(availableHeight * -1);

    output.push(`┌${"─".repeat(this.dimensions.width - borderWidth)}┐`);
    output.push(
      `│ ${white(this.title)}${" ".repeat(
        this.dimensions.width - borderWidth * 2 - this.title.length
      )} │`
    );
    output.push(`├${"─".repeat(this.dimensions.width - borderWidth)}┤`);

    for (let i = 0; i < availableHeight; i++) {
      const line = visibleLines[i] || "";
      output.push(
        `│ ${dim(line)}${" ".repeat(
          this.dimensions.width - borderWidth * 2 - line.length
        )} │`
      );
    }

    output.push(`└${"─".repeat(this.dimensions.width - borderWidth)}┘`);
    return [...output, ...this.renderComponents()];
  }

  public setDimensions(dimensions: Dimensions) {
    this.dimensions = {
      ...dimensions,
      height: Math.floor(dimensions.height / 2), // Use half of the screen height
      offsetY: Math.floor(dimensions.height / 2), // Position at the bottom half
    };
    return this;
  }
}
