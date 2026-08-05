export interface CommonCommand {
  title: string;
  description: string;
  action: (...args: any[]) => Promise<void>;
}
