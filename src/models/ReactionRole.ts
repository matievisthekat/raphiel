import Mongoose from "mongoose";

export interface ReactionRole extends Mongoose.Document {
  guildID: string;
  roleID: string;
  emojiID: string;
  msgID: string;
  chanID: string;
}

export default Mongoose.model<ReactionRole>(
  "ReactionRole",
  new Mongoose.Schema({
    guildID: String,
    roleID: String,
    emojiID: String,
    msgID: String,
    chanID: String,
  })
);
