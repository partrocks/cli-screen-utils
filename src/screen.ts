import { notify } from "./helper/formattedText";
import { Key } from "./enum/keyMap";
import { Panel } from "./panels/panel";

export type Tab = {
  name: string;
  panel: Panel;
};

export type Dimensions = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

export class Screen {
  private _listeners: {
    [key: string]: ((screen: Screen) => void)[];
  } = {};

  private dimensions: Dimensions = {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  };

  constructor(public name: string, public panels: Panel[] = []) {
    // Set raw mode to capture key presses
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    this.panels.forEach((panel: Panel) => {
      panel.setHost(this);
    });

    // Bind methods to the class instance
    this.clearScreen = this.clearScreen.bind(this);

    // Get initial dimensions
    this.dimensions = {
      width: process.stdout.columns,
      height: process.stdout.rows,
      offsetX: 0,
      offsetY: 0,
    };

    // Listen for keypress events
    process.stdin.on("data", this.handleKeyPress.bind(this));

    // Listen for terminal resize events
    process.stdout.on("resize", this.updateDimensions.bind(this));

    this.sendToOutlet = this.sendToOutlet.bind(this);
  }

  public start = (): Screen => {
    this._listeners["start"]?.forEach((callback) => {
      callback(this);
    });

    return this.render();
  };

  public render = (): Screen => {
    this.clearScreen();

    const panelOutput: string[] = [];
    this.panels.forEach((panel: Panel) => {
      panel.setDimensions(this.dimensions);
      panelOutput.push(panel.render().join(`\n`));
    });

    process.stdout.write(panelOutput.join(`\n`));

    this._listeners["render"]?.forEach((callback) => {
      callback(this);
    });

    return this;
  };

  public onRender(callback: (screen: Screen) => void): Screen {
    this._listeners["render"] = [
      ...(this._listeners["render"] || []),
      callback,
    ];
    return this;
  }

  public onStart(callback: (screen: Screen) => void): Screen {
    this._listeners["start"] = [...(this._listeners["start"] || []), callback];
    return this;
  }

  public clearScreen() {
    process.stdout.write("\x1B[2J\x1B[0f");
  }

  private updateDimensions() {
    this.dimensions = {
      width: process.stdout.columns,
      height: process.stdout.rows,
      offsetX: 0,
      offsetY: 0,
    };
    this.render();
  }

  public sendToOutlet(line: string, outletName?: string): void {
    this.panels.forEach((cp: Panel) => {
      if (!cp) return;
      if (cp.isOutlet() && (outletName ? cp.name === outletName : true)) {
        cp.addLine(line);
      } else if (cp.hasOutletInTree()) {
        cp.delegateOutletSignal(line, outletName);
      }
    });
  }

  private handleKeyPress = (chunk: Buffer) => {
    const key = chunk.toString();

    if ([Key.CTRL_C, Key.CTRL_Q].includes(key as Key)) {
      this.clearScreen();
      process.stdout.write(notify(`Bye!`) + "\n");
      process.exit(0);
    }

    // delegate keypress to every panel
    this.panels.forEach((panel: Panel) => {
      panel.trigger("keypress", key);
    });

    this.render();
  };
}
