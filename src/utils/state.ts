import { CreateInitialGame } from "../lib/gamelogic/GameHelpers";

export interface MatchState {
  //matchId: number
  players: User[];
  winner: User | null;
  gameState: ChessGame;
}

export interface User {
  name: string;
  id: number;
}

export const initialGameState: MatchState = {
  players: [],
  winner: null,
  gameState: CreateInitialGame(),
};
