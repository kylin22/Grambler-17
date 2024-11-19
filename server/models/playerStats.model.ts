import { Document, Schema, model } from "mongoose";

interface GameState {
  userId: string;
  displayName: string;
}

const UserSchema = new Schema({
  userId: { type: String, required: true },
  displayName: { type: String },
});

const PlayerStats = model<GameState>("PlayerStats", UserSchema, "playerStats");

export { PlayerStats, GameState };