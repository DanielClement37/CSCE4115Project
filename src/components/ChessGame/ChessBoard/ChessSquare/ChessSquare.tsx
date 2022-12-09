import React from "react";
import { PieceType, Color } from "../../../../lib/enums/GameEnums";
import { ConvertToXY, CoordinateChange } from "../../../../lib/gamelogic/GameHelpers";
import './ChessSquare.css'

interface SquareProps {
  type: PieceType;
  color: Color;
  index: number;
  shade: string;
  move: string;
}


const ChessSquare = (props: SquareProps) => { //TODO: find way to make this less jank

  //TODO: this will be select Tile function
  const CheckSquareHandler = (event: React.MouseEvent<HTMLElement>) => {
    //console.log(CoordinateChange(props.index));
    console.log(props.index);
    //console.log(ConvertToXY(props.index));
  };  

  switch (props.type) {
    case PieceType.PAWN:
      if(props.color === Color.WHITE){
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/50px-Chess_plt45.svg.png'}  alt='white pawn'/>
          </div>
        );
      }else {
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/50px-Chess_pdt45.svg.png'}  alt='black pawn'/>
          </div>
        );
      }
    case PieceType.BISHOP:
      if(props.color === Color.WHITE){
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/50px-Chess_blt45.svg.png'}  alt='black bishop'/>
          </div>
        );
      }else {
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/50px-Chess_bdt45.svg.png'}  alt='black bishop'/>
          </div>
        );
      }
    case PieceType.KNIGHT:
      if(props.color === Color.WHITE){
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/50px-Chess_nlt45.svg.png'}  alt='white knight'/>
          </div>
        );
      }else {
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/50px-Chess_ndt45.svg.png'}  alt='black knight'/>
          </div>
        );
      }
    case PieceType.ROOK:
      if(props.color === Color.WHITE){
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/50px-Chess_rlt45.svg.png'}  alt='white rook'/>
          </div>
        );
      }else {
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/50px-Chess_rdt45.svg.png'}  alt='black rook'/>
          </div>
        );
      }
    case PieceType.QUEEN:
      if(props.color === Color.WHITE){
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/50px-Chess_qlt45.svg.png'}  alt='white queen'/>
          </div>
        );
      }else {
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/50px-Chess_qdt45.svg.png'}  alt='black queen' />
          </div>
        );
      }
    case PieceType.KING:
      if(props.color === Color.WHITE){
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/50px-Chess_klt45.svg.png'} alt='white king' />
          </div>
        );
      }else {
        return (
          <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}>
            <img src={'//upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/50px-Chess_kdt45.svg.png'} alt='black king'/>
          </div>
        );
      }
    default:
      return <div className={"square " + props.shade + " " + props.move} onClick={CheckSquareHandler}></div>;
  }
};

export default ChessSquare;
