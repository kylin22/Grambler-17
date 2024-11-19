import { type CollectOptions } from "../assets/text/terminalTypes";
import { usePlayerInfoStore } from "../store/playerInfo";
import saveAll from "./saveAll";

export default class TerminalEventHandler {
  constructor() {

  }

  async parseInput(currentTextBlockId: CollectOptions, input: string) {
    const playerInfoStore = usePlayerInfoStore();
    switch (currentTextBlockId) {
      case "displayName":
        if (!/^[A-Za-z0-9]+$/.test(input)) {
          return { invalid: "Your name must only contain letters or numbers." };
        } 
        if (input.length > 12) {
          return { invalid: "Your name cannot be longer than 12 characters." };
        }
        playerInfoStore.displayName = input;
        await saveAll()
        break;
      default:
        console.error(`Terminal collection does not recognise CollectOption. Check terminal.json or add it to terminalTypes.ts (CollectOptions)`);
    }
  }
}
