import { NextResponse } from "next/server";
import { getGameState, setGameState } from "@/lib/kv";

// GET /api/game-state
export async function GET() {
  try {
    const data = await getGameState();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load game state" },
      { status: 500 }
    );
  }
}

// POST /api/game-state
export async function POST(request: Request) {
  try {
    const data = await request.json();
    await setGameState(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save game state" },
      { status: 500 }
    );
  }
}
