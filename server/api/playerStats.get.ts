import { PlayerStats } from '~/server/models/playerStats.model';

export default defineEventHandler(async (event) => {
  const userId = getQuery(event).userId;

  if (!userId) {
    return { error: 'User ID is required' };
  }

  try {
    const playerStats = await PlayerStats.findOne({ userId: userId });

    if (!playerStats) {
      return null;
    }

    return { playerStats: playerStats.toObject() };
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return { error: 'Internal server error' };
  }
});