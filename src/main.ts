#!/usr/bin/env node
import { program, Command } from 'commander';
import type { CommonCommand } from './commands/abc';
import { ListCommand } from './commands/list';
import { Configuration } from './utils/config';
import { StashManager } from './utils/stash-manager';
import { SaveCommand } from './commands/save';
import { RestoreCommand } from './commands/restore';
import { DropCommand } from './commands/drop';
import pkg from '../package.json';
import { CompletionCommand } from './commands/completion';
import { CommandContext } from './utils/context';
import { CLIError } from './utils/cli-error';
import chalk from 'chalk';

function addCommand(prog: Command, command: CommonCommand) {

  prog
    .command(command.title)
    .description(command.description)
    .action(async (...args: unknown[]) => {
      try {
        return await command.action.bind(command)(...args);
      } catch (error: unknown) {
        if (error instanceof CLIError) {
          return console.log(
            chalk.redBright(error.cliMessage)
          );
        }
        throw error;
      }
    })
}


function main() {
  program
    .description("Manages git stash and code")
    .version(pkg.version);

  const ctx = new CommandContext();
  const config = new Configuration();
  const stashManager = new StashManager(config);

  [
    new ListCommand(stashManager),
    new SaveCommand(stashManager, config),
    new RestoreCommand(stashManager, config),
    new DropCommand(stashManager, config),
    new CompletionCommand(ctx),
  ].forEach((c) => addCommand(program, c));


  ctx.init(program);
  program.parse(process.argv);
}
main()

