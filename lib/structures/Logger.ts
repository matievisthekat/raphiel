import chalk from "chalk";
import moment from "moment";

export class Logger {
  /**
   * @returns A string
   * @private
   */
  private get date(): string {
    return moment().format("DD/MM/YYYY hh:mm:ss a");
  }

  /**
   * @param {*} msg The message to log
   * @public
   */
  public log(msg: unknown): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.bold("LOG  ")}  ${msg}`);
  }

  /**
   * @param {*} msg The message to log
   * @public
   */
  public warn(msg: unknown): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.yellow("WARN ")}  ${msg}`);
  }

  /**
   * @param {*} msg The message to log
   * @public
   */
  public info(msg: unknown): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.green("INFO ")}  ${msg}`);
  }

  /**
   * @param {*} msg The message to log
   * @public
   */
  public error(msg: unknown): void {
    console.log(`${chalk.grey(this.date)}   ${chalk.red("ERROR")}  ${msg}`);
  }
}
