import Mongoose from "mongoose";

export interface LevelRole extends Mongoose.Document {
  id: string;
  level: number;
}

export default Mongoose.model<LevelRole>(
  "LevelRole",
  new Mongoose.Schema({
    id: String,
    level: Number,
  })
);
