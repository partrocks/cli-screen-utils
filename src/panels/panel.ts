import { Screen, Dimensions } from "../screen";
import { Outlet } from "./outlet";

export type Listener = {
  [eventName: string]: (event: any) => void;
};

export class Panel {
  private host: Screen | null = null;
  protected listeners: Listener[] = [];
  protected isActive: boolean = true;
  protected dimensions: Dimensions = {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  };

  constructor(public name: string, public components: Panel[] = []) {
    this.listeners.push({
      keypress: this.onKeyPress.bind(this),
    });

    this.setHost = this.setHost.bind(this);
    this.getHost = this.getHost.bind(this);
  }

  public getSubPanels(): Panel[] {
    return this.components;
  }

  public setHost(host: Screen): Panel {
    this.host = host;
    this.getSubPanels().forEach((c) => {
      c.setHost(host);
    });
    return this;
  }

  public getHost(): Screen {
    if (!this.host) {
      throw new Error("Host not set");
    }
    return this.host;
  }

  public setActive(isActive: boolean): Panel {
    this.isActive = isActive;
    return this;
  }

  public trigger(eventName: string, event: any): void {
    if (!this.isActive) return;
    this.listeners.forEach((listener) => {
      if (listener[eventName]) {
        listener[eventName](event);
      }
    });
  }

  public registerListeners(newListeners: Listener[]): Panel {
    this.listeners = [...this.listeners, ...newListeners];
    return this;
  }

  public isOutlet(): this is Outlet {
    return "addLine" in this;
  }

  public hasOutletInTree(): boolean {
    return (
      this.isOutlet() || this.getSubPanels().some((c) => c.hasOutletInTree())
    );
  }

  public delegateOutletSignal(line: string, outletName?: string): Panel {
    this.getSubPanels().forEach((cp) => {
      if (!cp) return;
      if (cp.isOutlet() && (outletName ? cp.name === outletName : true)) {
        cp.addLine(line);
      } else if (cp.hasOutletInTree()) {
        cp.delegateOutletSignal(line, outletName);
      }
    });
    return this;
  }

  // @abstract
  public render(): string[] {
    return [...this.renderComponents()];
  }

  public renderComponents(): string[] {
    return this.components
      .map((c) => {
        c.setDimensions(this.dimensions);
        return c.render();
      })
      .flat();
  }

  public setDimensions(dimensions: Dimensions): Panel {
    this.dimensions = dimensions;
    this.getSubPanels().forEach((c) => c.setDimensions(dimensions));
    return this;
  }

  protected sendToConsole(line: string): Panel {
    this.getHost().sendToOutlet(line);
    return this;
  }

  protected onKeyPress(key: string): Panel {
    this.components.forEach((c) => c.trigger("keypress", key));
    return this;
  }
}
