import { confirm, select } from "@inquirer/prompts";
import { Configuration } from "../utils/config";
import { StashManager } from "../utils/stash-manager";
import { CommonCommand } from "./abc";
import chalk from "chalk";

export class DropCommand implements CommonCommand {
  title = "drop [name]"
  description = "Permanently deletes the selected stash"

  constructor(private readonly stashManager: StashManager,private readonly config: Configuration){}

  async action(name: string | undefined){

    const stashes = await this.stashManager.list();

    if (!name) {
      name = await select({message: "Select the stash you with to delete:", choices: stashes.map(stash => stash.name)})
    }
    
    const prefix = await this.config.get<string>('prefix');
    if (!name.startsWith(prefix)) {
      name = prefix + name;
    }

    
    const stash = stashes.find(s => s.name === name);
    if (!stash) return console.log(
      chalk.red(`Stash with name '${name}' does not exist!`)
    )

    const confirmation = await confirm({message: `Are you sure you wish to delete '${stash.name}'?`})
    if (!confirmation) {
      return console.log(
        chalk.yellowBright("Operation cancelled!")
      )
    }

    this.stashManager.drop(stash.index);
    console.log(
      chalk.greenBright(`Stash '${stash.name}' deleted successfully!`)
    );
  }
}
