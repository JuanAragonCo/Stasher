import { select } from "@inquirer/prompts";
import { StashManager } from "../utils/stash-manager";
import { CommonCommand } from "./abc";
import chalk from "chalk";
import { Configuration } from "../utils/config";

export class RestoreCommand implements CommonCommand {
  title = "restore [name]"
  description  = "Restores the provided stash"

  constructor(private readonly stashManager: StashManager, private readonly config: Configuration){}

  async action(name: string | undefined) {
    const stashes = await this.stashManager.list();

    if (!name) {
      name = await select({message: 'Select the stash', choices: stashes.map(stash => stash.name)})
    }

    const prefix = await this.config.get<string>('prefix');
    if (!name?.startsWith(prefix)) {
      name = prefix + name;
    }

    const stash = stashes.find(stash => stash.name === name);
    if (!stash) return console.log(
      chalk.red(`Stash with the name '${name}' not found`)
    )

    this.stashManager.restore(stash.index)
    console.log(
      chalk.green(`Changes from '${stash.name}' applied!`)
    )
  }
}
