import { PlayerStats } from "~/server/models/playerStats.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;
  if (body.userId) {
    try {
      const updatedPlayerStats = await PlayerStats.findOneAndUpdate(
        { userId: userId },
        { $set: body },
        { new: true }
      );
  
      if (updatedPlayerStats) {
        return { playerStats: updatedPlayerStats.toObject() };
      }
  
      // Create new document
      const newPlayerStats = new PlayerStats({ userId, ...body });
      await newPlayerStats.save();

      console.log(`Game state saved successfully`);
    } catch (error) {
      console.error("Error saving game state:", error); //TODO handle save error
    }
  }
  return { success: true };
});