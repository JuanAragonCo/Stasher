import type { StashManager } from "../utils/stash-manager";
import type { CommonCommand } from "./abc"
import chalk from "chalk";

export class ListCommand implements CommonCommand {
  title = 'list'
  description = 'List stashes'

  constructor(
    private readonly stashManager: StashManager
  ) {
  }


  async action() {
    const stashes = await this.stashManager.list();
    const lines = stashes.map(item => chalk.green(`✓ [${item.index}] `) + chalk.blueBright(item.name)).join('\n')
    console.log(lines)
  }
}
