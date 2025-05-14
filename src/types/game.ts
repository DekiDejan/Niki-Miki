export interface Player {
  name: string;
  gameScore: number;
  setScore: number;
}

export interface GameState {
  players: {
    niki: Player;
    miki: Player;
  };
  history: ScoreChange[];
}

export interface ScoreChange {
  timestamp: number;
  player: string;
  type: "game" | "set";
  points: number;
}

export const initialGameState: GameState = {
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
