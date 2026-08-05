import chalk from "chalk";
import { CommonCommand } from "./abc";
import { CommandContext } from "../utils/context";

export class CompletionCommand implements CommonCommand {
  title = "completion <shell>"
  description = "Generates completion a completion file for the provided shell"

  constructor(private readonly ctx: CommandContext) {}

  private async generateBash() {
    const program = this.ctx.program;
    const commands = program.commands.map(c => c.name());

    const text = `
      _stasher_completion() {
        local cur="\${COMP_WORDS[COMP_CWORD]}"
        
        case "\${COMP_CWORD}" in
          1)
            COMPREPLY=( $(compgen -W "${commands.join(" ")}" -- "$cur") )
            ;;
        esac
      }
      complete -F _stasher_completion stasher
      complete -F _stasher_completion sts
    `;

    console.log(text);
  }

  async action(shell: string) {
    if (shell.toLowerCase().trim() === "bash") {
      return await this.generateBash()
    }


    console.log(
      chalk.red(`There is no valid completion mechanisms for the '${shell}'`)
    );
  }


}
