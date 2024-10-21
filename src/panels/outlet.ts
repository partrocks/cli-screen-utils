import { Panel } from "./panel";

export interface IOutlet {
  addLine(line: string): void;
  clear(): void;
}

// declare an abstract class that implements Outlet
export abstract class Outlet extends Panel implements IOutlet {
  abstract addLine(line: string): void;
  abstract clear(): void;
}
