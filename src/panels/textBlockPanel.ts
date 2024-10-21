import { padded } from "../helper/formattedText";
import { Panel } from "./panel";

export class TextBlockPanel extends Panel {
  constructor(public name: string, private text: string) {
    super(name, []);
  }

  public render(): string[] {
    return [this.text, ...this.renderComponents()];
  }
}
