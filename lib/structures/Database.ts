import { EventEmitter } from "events";
import Mongoose, { ConnectionOptions } from "mongoose";
import { DatabaseOptions } from "..";
import { Util } from "./Util";

export class Database extends EventEmitter {
  public modelsPath: string;
  private uri: string;
  private options: ConnectionOptions;

  constructor(opts: DatabaseOptions) {
    super();

    this.modelsPath = opts.modelsPath;
    this.uri = `mongodb+srv://${opts.user}:${opts.password}@${opts.host}/${opts.db}`;
    this.options = opts.options;
  }

  /**
   * @returns {Promise<any>} The resolved connection
   * @public
   */
  public async load(): Promise<unknown> {
    this.loadModels(this.modelsPath);
    return await Mongoose.connect(this.uri, this.options)
      .then((connection) => this.emit("ready", connection))
      .catch((err) => this.emit("error", err));
  }

  private loadModels(path: string): void {
    const files = Util.findNested(path);
    for (const file of files) require(file);
  }
}
