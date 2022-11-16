import React, { useReducer } from "react";
import MoveHistory from "./MoveHistory/MoveHistory";
import ChessBoard from "./ChessBoard/ChessBoard";
import { GameContext } from "../../utils/context";
import { gameReducer } from "../../utils/reducer";
import { initialGameState } from "../../utils/state";

const ChessGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className="game-container">
        <ChessBoard />
        <MoveHistory />
      </div>
    </GameContext.Provider>
  );
};

export default ChessGame;
