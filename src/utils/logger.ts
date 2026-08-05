export class Logger {
  constructor(private readonly name: string) {}

  error(value: unknown) {
    console.error(`${this.name}: ${value}`);
  }
}
