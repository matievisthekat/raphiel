import Mongoose from "mongoose";
import { ModLog } from "../../lib";

export interface User extends Mongoose.Document {
  id: string;
  developer: boolean;
  bgUrl: string;
  desc: string;
  infractions: Infraction[];
}

interface Infraction {
  timestamp: string;
  authorID: string;
  type: ModLog;
  reason?: string;
}

export default Mongoose.model<User>(
  "User",
  new Mongoose.Schema({
    id: { required: true, type: String },
    developer: { required: false, default: false, type: Boolean },
    bgUrl: {
      required: false,
      default:
        "https://lh3.googleusercontent.com/proxy/UmrZl9x-RHVX0yagDceQMU0aq4qWMTa96U9pfKsgOWx75GS6lIFaNC7Xe290TksDSGidt0z_7eBOHqHQyCL80g5RQC9Hsao8RlqN_OenSF-x5HRaWu8HkNK_OPutgA",
      type: String,
    },
    desc: { required: false, default: "No description set", type: String },
    infractions: { required: false, default: [], type: Array },
  })
);
