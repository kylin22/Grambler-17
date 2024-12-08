import { defineStore } from 'pinia'

export const usePlayerInfoStore = defineStore("playerInfo", {
  state: () => ({ 
      userId: "",
      displayName: "",
  }),
  actions: {
    updateDisplayName(newDisplayName: string) {
      this.displayName = newDisplayName;
    }
  }
});
