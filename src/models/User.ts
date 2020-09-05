import Mongoose from "mongoose";
import { resolve } from "path";

export interface User extends Mongoose.Document {
  id: string;
  developer: boolean;
  bgUrl: string;
  desc: string;
}

export default Mongoose.model<User>(
  "User",
  new Mongoose.Schema({
    id: { required: true, type: String },
    developer: { default: false, type: Boolean },
    bgUrl: {
      required: false,
      default:
        "https://lh3.googleusercontent.com/proxy/UmrZl9x-RHVX0yagDceQMU0aq4qWMTa96U9pfKsgOWx75GS6lIFaNC7Xe290TksDSGidt0z_7eBOHqHQyCL80g5RQC9Hsao8RlqN_OenSF-x5HRaWu8HkNK_OPutgA",
      type: String,
    },
    desc: { required: false, default: "No description set", type: String },
  })
);
