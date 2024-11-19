import { Document, Schema, model } from "mongoose";

interface IMap extends Document {
  userId: string;
}

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
});

const Map = model<IMap>("Map", UserSchema, "maps");

export { Map, IMap };