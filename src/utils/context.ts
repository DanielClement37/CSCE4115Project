import React from "react";
import { MatchState, initialGameState } from "./state";
import { GameActions } from "./actions";

export const GameContext = React.createContext<{
  state: MatchState;
  dispatch: React.Dispatch<GameActions>;
}>({
  state: initialGameState,
  dispatch: () => undefined,
});
