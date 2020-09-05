import { Bot, Util } from "../lib";
import { join, resolve } from "path";
import { registerFont } from "canvas";

Util.loadEnv(join(__dirname, "../../", ".env.json"));

registerFont(resolve("./fonts/indie-flower.ttf"), {
  family: "Indie Flower",
});

const client = new Bot(
  {
    partials: ["REACTION"],
    ws: {
      properties: {
        $browser: "Discord iOS",
      },
    },
    presence: {
      activity: {
        name: "you sleep",
        type: "WATCHING",
      },
      status: "idle",
    },
  },
  {
    token: process.env["bot.token"],
    prefix: "./",
    devs: ["492708936290402305"],
    eventDir: join(__dirname, "events"),
    commandDir: join(__dirname, "commands"),
    database: {
      host: process.env["db.host"],
      user: process.env["db.user"],
      password: process.env["db.password"],
      db: process.env["db.name"],
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      modelsPath: join(__dirname, "models"),
    },
  }
);

client.cmd.on("ready", (commands) => client.logger.log(`Loaded ${commands.size} commands`));
client.evnt.on("ready", (events) => client.logger.log(`Loaded ${events.size} events`));
client.db.on("ready", () => client.logger.log(`Connected to database at ${process.env["db.host"]}`));
client.db.on("error", (err) => client.logger.error(err));

process.on("uncaughtException", (err) => client.handleProcessError(err));
process.on("unhandledRejection", (err) => client.handleProcessError(err));
process.on("uncaughtExceptionMonitor", (err) => client.handleProcessError(err));

client
  .load()
  .then(([success, err]) => {
    if (err) console.error(err);
    if (!success) return console.log("Failed to initialize. There should be additional logging above");

    client.logger.log("Successfully initialized");
  })
  .catch((err) => client.logger.error(`Failed to initialize: ${err.message}`));
