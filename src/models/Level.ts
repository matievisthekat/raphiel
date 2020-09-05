import Mongoose from "mongoose";

export interface Level extends Mongoose.Document {
  uid: string;
  xp: number;
  level: number;
}

export default Mongoose.model<Level>(
  "Level",
  new Mongoose.Schema({
    uid: { required: true, type: String },
    xp: { required: false, type: Number, default: 0 },
    level: { required: false, type: Number, default: 0 },
  })
);
