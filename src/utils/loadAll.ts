import type { GameState } from "~/server/models/playerStats.model";
import { usePlayerInfoStore } from "../store/playerInfo";
import saveAll from "./saveAll";

interface Stats {
  playerStats: GameState;
}

const loadAll = async(id: string) => {
  const playerInfoStore = usePlayerInfoStore();
  try {
    const { data: playerData, error } = await useFetch<Stats>("/api/playerStats", {
      query: { userId: id }
    });
    if (!playerData.value) {
      playerInfoStore.userId = id;
      await saveAll();
      console.log(`New player with id ${id} created.`);
    } else {
      const retrievedStats = playerData.value.playerStats;
      playerInfoStore.userId = retrievedStats.userId;
      playerInfoStore.displayName = retrievedStats.displayName;
    }
    
    console.log('Called load API');
  } catch (error) {
    console.error('load API failed: ', error);
  }
}

export default loadAll;