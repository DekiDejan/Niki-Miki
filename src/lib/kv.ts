import { kv } from "@vercel/kv";

export const getGameState = async () => {
  try {
    const state = await kv.get("gameState");
    if (!state) {
      // Return initial state if no state exists
      return {
        players: {
          niki: {
            name: "Niki",
            gameScore: 0,
            setScore: 0,
          },
          miki: {
            name: "Miki",
            gameScore: 0,
            setScore: 0,
          },
        },
        history: [],
      };
    }
    return state;
  } catch (error) {
    console.error("Failed to get game state:", error);
    throw error;
  }
};

export const setGameState = async (state: any) => {
  try {
    await kv.set("gameState", state);
    return true;
  } catch (error) {
    console.error("Failed to set game state:", error);
    throw error;
  }
};
