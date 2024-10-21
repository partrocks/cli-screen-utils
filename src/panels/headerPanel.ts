import { header } from "../helper/formattedText";
import { Panel } from "./panel";

export class HeaderPanel extends Panel {
  constructor(public name: string, private copy: string) {
    super(name, []);
    this.isActive = false;
  }

  public render(): string[] {
    return [header(this.copy, this.dimensions)];
  }
}
