import { Logger } from "./logger"
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import envPaths from "env-paths";
import path from "node:path";
import { parse, stringify } from "smol-toml";

const paths = envPaths("stasher");

const logger = new Logger('Config');

export class Configuration {
  _data = {}
  _loaded = false;

  constructor() {
    this.load()
      .then(() => this._loaded = true)
      .catch(() => logger.error("Error loading config file."));
  }

  private async fileExists(p: string) {
    try {
      await access(p);
      return true;
    } catch {
      return false;
    }
  }

  private async createDefault(confPath: string) {
    await mkdir(path.dirname(confPath), {recursive: true});
    
    const data = stringify({prefix: 'stasher-'});
    await writeFile(confPath, data);
  }
  
  async load() {
    
    const configPath = path.join(
      paths.config,
      'config.tml'
    );
    const exists = await this.fileExists(configPath);

    if (!exists) {
      await this.createDefault(configPath)
    }

    const data = await readFile(configPath);
    this._loaded = true;
    return this._data = parse(data.toString());
  }

  async data() {
    if (!this._loaded) {
      await this.load();
    }
    return this._data;
  }

  async get<T>(key: string) : Promise<T> {
    const data = await this.data()
    return data[key as keyof typeof data] as T;
  }

}
