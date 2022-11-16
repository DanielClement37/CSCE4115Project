import { GameActions, ResetGame, MakeMove, UndoMove, ActionType } from "./actions";
import {  MatchState, initialGameState } from "./state";

export function gameReducer(state: MatchState, action: GameActions): MatchState {
  switch (action.type) {
    case ActionType.ResetGame:
      return {
        ...initialGameState,
        players: state.players.map((player) => ({
          ...player,
        })),
      };
    default:
      return state;
  }
}
