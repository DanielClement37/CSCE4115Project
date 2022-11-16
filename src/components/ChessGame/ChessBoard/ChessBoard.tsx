import React, { useContext, ReactNode } from "react";
import { GameContext } from "../../../utils/context";
import ChessSquare from "./ChessSquare/ChessSquare";
import "./ChessBoard.css";
import { GenerateMoves } from "../../../lib/gamelogic/MoveGen";

const ChessBoard = () => {
  const { state } = useContext(GameContext);
  const { gameState } = state;
  const { currPosition } = gameState;

  const squares = (): ReactNode => {
    let squareArr: ReactNode[] = [];
    let index = 0;
    let shade = "light-square";
    let moves: Move[] = GenerateMoves(currPosition);
    let isMove = "";
    console.log(moves.length);
    currPosition.squares.forEach(function (sq: Piece) {
      if (index % 8 !== 0 && index !== 0) {
        shade = shade === "light-square" ? "dark-square" : "light-square";
      }
      //TODO: Eventually remove debug display
      moves.forEach((move) => { 
        if (index === move.toSquare) {
          isMove = "move";
        }
      });
      if(currPosition.enPassantSquare !== null){
        if(index === currPosition.enPassantSquare){
          isMove = "move";
        }
      }

      squareArr.push(<ChessSquare key={index} type={sq.type} color={sq.color} shade={shade} move={isMove} />);
      isMove = "";
      index++;
    });

    return squareArr;
  };

  return <div className="board-container">{squares()}</div>;
};

export default ChessBoard;
