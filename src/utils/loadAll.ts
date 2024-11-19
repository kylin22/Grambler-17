import type { GameState } from "~/server/models/playerStats.model";
import { usePlayerInfoStore } from "../store/playerInfo";
import saveAll from "./saveAll";

const loadAll = async(id: string) => {
  const playerInfoStore = usePlayerInfoStore();
  try {
    const { data: playerData, error } = await useFetch<GameState>("/api/playerStats", {
      query: { userId: id }
    });
    if (!playerData.value) {
      playerInfoStore.userId = id;
      await saveAll();
      console.log(`New player with id ${id} created.`);
    } else {
      playerInfoStore.userId = playerData.value.userId;
      playerInfoStore.displayName = playerData.value.displayName;
    }
    console.log('Called load API');
  } catch (error) {
    console.error('load API failed: ', error);
  }
}

export default loadAll;