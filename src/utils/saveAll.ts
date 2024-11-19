import type { GameState } from "~/server/models/playerStats.model";
import { usePlayerInfoStore } from "../store/playerInfo";

const saveAll = async() => {
  const playerInfoStore = usePlayerInfoStore();
  try {
    await useFetch("/api/playerStats", {
      method: 'POST',
      body: {
        userId: playerInfoStore.userId,
        displayName: playerInfoStore.displayName
      } as GameState
    });
    console.log('Called save API');
  } catch (error) {
    console.error('save API failed: ', error);
  }
}

export default saveAll;