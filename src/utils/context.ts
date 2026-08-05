import { Command } from "commander";

export class CommandContext {
  private _program: Command | undefined;
  private _isInit = false;

  constructor() {}

  get program() {
    if (!this._isInit) throw new Error("Command context hasn't been initialized");
    return this._program as Command
  }
  

  init(program: Command) {
    this._isInit = true;
    this._program = program;
  }
}
