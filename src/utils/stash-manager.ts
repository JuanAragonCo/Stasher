import { execSync } from "node:child_process";
import type { Configuration } from "./config";
import chalk from "chalk";
import { CLIError } from "./cli-error";

export class StashManager {

  constructor(private readonly config: Configuration) {}

  private cmd(c: string) : [boolean, string] {
    try {
      return [true, execSync(c).toString()];
    } catch (exception: unknown) {
      if (exception instanceof Error && "stderr" in exception) {
        const stdErr : Buffer = exception.stderr as Buffer;
        return [false, stdErr.toString()];
      }
      throw exception;
    }
  }

  private async parseList(stdout: string) {

    const prefix = await this.config.get<string>('prefix')

    const regex = /stash@\{(\d+)\}: On (\S+): (.*)/i
    const items = [];
    for (const line of stdout.split('\n')) {
      const match = line.match(regex);
      if (!match) continue;

      const name = match[3];
      if (!name?.startsWith(prefix)) continue;

      const index = match[1];
      const branch = match[2];

      items.push({
        name,
        index: Number(index),
        branch
      })


    }
    return items;
  }

  list() {
    const [success, result] = this.cmd('git stash list');
    if (!success) {
      throw new CLIError("Error getting list of stashes");
    }
    return this.parseList(result);
  }

  save(name: string, override_index: number) {
    name = name.replace(/\s+/g, '-');

    if (override_index !== -1) {
      const [ success ] = this.cmd(`git stash drop ${override_index}`)
      if (!success) {
        throw new CLIError("Not possible to drop the current stash")
      }
    }

    const [ successAdd ] = this.cmd("git add ."); // Stage all files
    if (!successAdd) throw new CLIError("Error while creating a new stash")

    const [ successPush ] = this.cmd(`git stash push -m ${name}`)
    if (!successPush) throw new CLIError("Error while creating a new stash")
  }

  restore(index: number) {
    const [successApply ] = this.cmd(`git stash apply ${index}`);
    if (!successApply) throw new CLIError("Error while applying the stash")

    const [successStaged] = this.cmd('git restore --staged .');
    if (!successStaged) throw new CLIError("Error while restoring the staged files");
  }

  drop(index: number) {
    const [success]= this.cmd(`git stash drop ${index}`);
    if (!success) throw new CLIError("It wasn't possible to drop the existing stash");
  }

}
