import { Config } from "../lib";

const config: Config = {
  emoji: {
    success: {
      custom: "<:checkemoji:672073550886338626>",
      default: ":white_check_mark:",
    },
    error: {
      custom: "<:xemoji:672073562307297293>",
      default: ":x:",
    },
    warn: {
      custom: "<:warn:733277985133690881>",
      default: ":warning:",
    },
  },
  colours: {
    default: "#0099FF",
    green: "#00CC33",
    red: "#FF0033",
    yellow: "#FFCC33",
  },
};

export default config;
