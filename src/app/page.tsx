"use client";

import { useGameState } from "@/hooks/useGameState";
import { format } from "date-fns";

export default function Home() {
  const { gameState, isLoading, addGamePoints, addSet, resetGame, resetAll } =
    useGameState();
  const { niki, miki } = gameState.players;

  const getLeadingPlayer = () => {
    if (niki.gameScore === miki.gameScore) return null;
    return niki.gameScore > miki.gameScore ? "niki" : "miki";
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading game state...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text pb-1">
            Backgammon Score Tracker
          </h1>
          <p className="text-slate-600 text-lg">Custom made for Niki & Miki</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Player Sections */}
          {["niki", "miki"].map((playerKey) => {
            const player =
              gameState.players[playerKey as keyof typeof gameState.players];
            const isLeading = getLeadingPlayer() === playerKey;

            return (
              <div
                key={playerKey}
                className={`p-6 ${
                  isLeading ? "card-highlight" : "card"
                } transform transition-all duration-300 hover:scale-105 active:scale-95`}
              >
                <h2 className="text-xl md:text-2xl font-bold text-center mb-4 capitalize bg-gradient-to-r from-slate-700 to-slate-900 text-transparent bg-clip-text">
                  {player.name}
                </h2>

                <div className="text-center mb-6">
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-blue-600">
                    {player.gameScore}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Game Score
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-semibold text-purple-600">
                    {player.setScore}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Sets Won
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() =>
                      addGamePoints(playerKey as "niki" | "miki", 1)
                    }
                    className="btn btn-success"
                  >
                    +1 Point
                  </button>
                  <button
                    onClick={() =>
                      addGamePoints(playerKey as "niki" | "miki", 2)
                    }
                    className="btn btn-success"
                  >
                    +2 Points
                  </button>
                </div>

                <button
                  onClick={() => addSet(playerKey as "niki" | "miki")}
                  className="w-full btn btn-primary"
                >
                  Win Set
                </button>
              </div>
            );
          })}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={resetGame} className="btn btn-warning">
            Reset Game Scores
          </button>
          <button onClick={resetAll} className="btn btn-danger">
            Reset All Scores
          </button>
        </div>

        {/* History Log */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 flex justify-between items-center">
            <span>Game History</span>
            <span className="text-sm text-slate-500">
              {gameState.history.length} changes
            </span>
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50">
            {gameState.history.length === 0 ? (
              <div className="text-center text-slate-500 py-4">
                No changes recorded yet
              </div>
            ) : (
              gameState.history.map((change, index) => (
                <div
                  key={index}
                  className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-slate-800">
                    {format(change.timestamp, "HH:mm:ss")}
                  </span>{" "}
                  -{" "}
                  <span className="capitalize font-medium text-blue-600">
                    {change.player}
                  </span>{" "}
                  {change.type === "game" ? (
                    <span>
                      scored{" "}
                      <span className="font-medium text-green-600">
                        {change.points} point{change.points > 1 ? "s" : ""}
                      </span>
                    </span>
                  ) : (
                    <span className="font-medium text-purple-600">
                      won a set
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
