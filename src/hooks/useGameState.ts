import { useState, useEffect } from "react";
import { GameState, initialGameState, ScoreChange } from "@/types/game";

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state from the API
  useEffect(() => {
    const loadState = async () => {
      try {
        const response = await fetch("/api/game-state");
        if (!response.ok) throw new Error("Failed to load game state");
        const data = await response.json();
        setGameState(data);
      } catch (error) {
        console.error("Failed to load game state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Save state to the API whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        const response = await fetch("/api/game-state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameState),
        });
        if (!response.ok) throw new Error("Failed to save game state");
      } catch (error) {
        console.error("Failed to save game state:", error);
      }
    };

    if (!isLoading) {
      saveState();
    }
  }, [gameState, isLoading]);

  const addGamePoints = (player: "niki" | "miki", points: number) => {
    setGameState((prev) => {
      const newState: GameState = {
        ...prev,
        players: {
          ...prev.players,
          [player]: {
            ...prev.players[player],
            gameScore: prev.players[player].gameScore + points,
          },
        },
        history: [
          {
            timestamp: Date.now(),
            player,
            type: "game",
            points,
          },
          ...prev.history,
        ],
      };
      return newState;
    });
  };

  const addSet = (player: "niki" | "miki") => {
    setGameState((prev) => {
      // First, create a new players object with both game scores reset
      const updatedPlayers = {
        niki: { ...prev.players.niki, gameScore: 0 },
        miki: { ...prev.players.miki, gameScore: 0 },
      };

      // Then increment the set score for the winning player
      updatedPlayers[player].setScore = prev.players[player].setScore + 1;

      const newState: GameState = {
        ...prev,
        players: updatedPlayers,
        history: [
          {
            timestamp: Date.now(),
            player,
            type: "set",
            points: 1,
          },
          ...prev.history,
        ],
      };
      return newState;
    });
  };

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      players: {
        ...prev.players,
        niki: { ...prev.players.niki, gameScore: 0 },
        miki: { ...prev.players.miki, gameScore: 0 },
      },
    }));
  };

  const resetAll = () => {
    setGameState(initialGameState);
  };

  return {
    gameState,
    isLoading,
    addGamePoints,
    addSet,
    resetGame,
    resetAll,
  };
};
