import chalk from "chalk";
import type { StashManager } from "../utils/stash-manager"
import type { CommonCommand } from "./abc"
import { confirm, input, select } from '@inquirer/prompts';
import { Configuration } from "../utils/config";

export class SaveCommand implements CommonCommand {
  title = "save [name]"
  description = "Stores a stash with the given name plus prefix"
  _otherName = "Create new...";

  constructor(
    private readonly stashManager : StashManager, 
    private readonly config: Configuration
  ) {
  }

  async action(name: string | undefined) {
    const stashes = await this.stashManager.list();

    if (!name) {
      name = await select({message: "Select an existing stash", choices: [...stashes.map(s => s.name), this._otherName]});
    }

    if (name === this._otherName) {
      name = await input({message: "Enter a name for the new stash"})
    }

    const prefix = await this.config.get<string>('prefix');
    if (!name.startsWith(prefix)) {
      name = prefix + name;
    }

    let shouldWrite = true;
    const exists = stashes.some(stash => stash.name === name)

    if (exists) {
      shouldWrite = await confirm({message: `The stash with the name ${name} already exist, do you want to override it?`})
    }

    if (!shouldWrite) {
      console.log(
        chalk.yellow("Operation cancelled")
      )
      return;
    }

    const stash = stashes.find(s => s.name === name);
    this.stashManager.save(name, stash ? stash.index : -1);

    console.log(
      chalk.green("Success!!")
    )
  }

}
