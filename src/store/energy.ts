import { defineStore } from 'pinia'

export const useEnergyStore = defineStore("energy", {
  state: () => ({ 
      amount: 0,
      capacity: 0
  }),
  actions: {
    updateAmount(newAmount: number) {
      this.amount = newAmount;
    },
    updateCapacity(newCapacity: number) {
      this.capacity = newCapacity;
    }
  }
});
