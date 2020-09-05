["String", "User", "Message"].forEach((extension) => require(`./structures/extend/${extension}`));

export * from "./structures/Client";
export * from "./structures/base/Command";
export * from "./structures/base/Event";
export * from "./structures/managers/CommandManager";
export * from "./structures/managers/EventManager";
export * from "./structures/Database";
export * from "./structures/Logger";
export * from "./structures/extend/Embed";
export * from "./types";
export * as util from "./structures/Util";
export * from "./structures/Util";
