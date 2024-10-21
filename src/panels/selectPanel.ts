import { bold, dim, white, yellow } from "../helper/formattedText";
import { Panel } from "./panel";
import { Key } from "../enum/keyMap";
import { CharMap } from "../enum/charMap";
import { Screen } from "../screen";

interface SelectOption {
  label: string;
  handler: (s: Screen) => void;
}

export class SelectPanel extends Panel {
  private selectedIndex: number = 0;

  constructor(
    public name: string,
    private title: string,
    private options: SelectOption[]
  ) {
    super(name, []);
  }

  public render(): string[] {
    const out: string[] = [];
    out.push("");
    out.push(this.title);
    out.push("");
    const choices = this.options.map((option: SelectOption, i: number) => {
      return i !== this.selectedIndex
        ? `${yellow(CharMap.RadioUnselected)} - ${white(dim(option.label))}`
        : `${yellow(CharMap.RadioSelected)} - ${yellow(bold(option.label))}`;
    });
    return [...out, ...choices, ...this.renderComponents()];
  }

  protected onKeyPress(key: string): Panel {
    if (key === Key.DOWN_ARROW) {
      this.selectedIndex++;
    }

    if (key === Key.UP_ARROW) {
      this.selectedIndex--;
    }

    if (this.selectedIndex < 0) {
      this.selectedIndex = this.options.length - 1;
    }

    if (this.selectedIndex >= this.options.length) {
      this.selectedIndex = 0;
    }

    if (key === Key.ENTER) {
      const selectedOption = this.options[this.selectedIndex];
      if (selectedOption) {
        selectedOption.handler(this.getHost());
      }
    }

    return this;
  }
}
