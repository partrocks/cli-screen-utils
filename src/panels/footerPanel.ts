import { fullWidth, greenBar } from "../helper/formattedText";
import { Panel } from "./panel";

export class FooterPanel extends Panel {
  constructor(public name: string, private copy: string) {
    super(name, []);
    this.isActive = false;
  }

  public render(): string[] {
    //process.stdout.write(`\x1b[${this.dimensions.height + 1};1H`);
    return [greenBar(fullWidth(this.copy, this.dimensions))];
  }
}
