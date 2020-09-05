/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CustomEvent, Bot } from "../../lib/";

export default class extends CustomEvent {
  constructor(client: Bot) {
    super(client, {
      name: "",
      __filename,
    });
  }

  /**
   * @param {Bot} client The client that received this event
   */
  public async run(client: Bot): Promise<unknown> {
    return client.logger.warn(`Event run method empty at ${__filename}`);
  }
}
