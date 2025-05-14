import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "game-state.json");

// Ensure the data directory exists
async function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// GET /api/game-state
export async function GET() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // If file doesn't exist, return initial state
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const initialState = {
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
      return NextResponse.json(initialState);
    }
    return NextResponse.json(
      { error: "Failed to load game state" },
      { status: 500 }
    );
  }
}

// POST /api/game-state
export async function POST(request: Request) {
  try {
    await ensureDataDir();
    const data = await request.json();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save game state" },
      { status: 500 }
    );
  }
}
