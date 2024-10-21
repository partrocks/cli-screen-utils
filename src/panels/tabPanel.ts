import { green, tabBtn } from "../helper/formattedText";
import { Panel } from "./panel";
import { Screen, Dimensions, Tab } from "../screen";
import { Key } from "../enum/keyMap";

export class TabPanel extends Panel {
  private activeTab: number = 0;
  private tabs: Tab[] = [];

  constructor(public name: string, _tabs: Tab[]) {
    super(name, []);
    this.tabs = _tabs;
  }

  public render(): string[] {
    let out: string[] = [];
    let tabBarLine: string[] = [];

    this.tabs.forEach((t: Tab, i: number) => {
      const isActive = i === this.activeTab;
      t.panel.setActive(i === this.activeTab);
      tabBarLine.push(tabBtn(`<${t.name}>`, isActive));
    });
    out.push(green(tabBarLine.join(""))); // horizontal tab bar

    const activePanelContent = this.tabs[this.activeTab]?.panel.render() || [];

    return [...out, "", ...activePanelContent, ...this.renderComponents()];
  }

  // Override setHost to set host on all Tabs
  public setHost(host: Screen): Panel {
    this.tabs.forEach((t) => {
      t.panel.setHost(host);
    });
    return super.setHost(host);
  }

  public getSubPanels(): Panel[] {
    return [...super.getSubPanels(), ...this.tabs.map((t) => t.panel)];
  }

  protected onKeyPress(key: string): Panel {
    if (key === Key.TAB) {
      this.activeTab = (this.activeTab + 1) % this.tabs.length;
    } else {
      this.tabs[this.activeTab]?.panel.trigger("keypress", key);
    }
    return this;
  }
}
