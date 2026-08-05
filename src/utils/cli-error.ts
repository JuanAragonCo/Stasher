export class CLIError extends Error {
  constructor(public readonly cliMessage: string) {
    super("CLI Error")
  }
}
