import { Structures } from "discord.js";
import { Bot } from "../..";
import { Client } from "discord.js";

Structures.extend(
  "User",
  (User) =>
    class extends User {
      public developer: boolean;

      // eslint-disable-next-line @typescript-eslint/ban-types
      constructor(client: Bot | Client, data: object) {
        super(client, data);

        this.developer = client.devs.includes(this.id);
      }
    }
);
