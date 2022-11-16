import { PieceType, Color, MoveType } from "../enums/GameEnums";
import { ConvertToIndex, ConvertToXY, CoordinateChange, CreateMove, CreateMoveTwoSquare, CreatePiece, CreatePosition, SwitchTo120 } from "./GameHelpers";

export const GenerateMoves = (position: Position): Move[] => {
  let squares = position.squares;
  let legalMoves: Move[] = new Array(0);

  //do a pinned piece check here and make a list of pieces that can't move

  for (let i = 0; i < 64; i++) {
    if (position.player === squares[i].color) {
      switch (squares[i].type) {
        case PieceType.KNIGHT:
          legalMoves.push(...GenKnightMoves(squares, i, squares[i].color));
          break;
        case PieceType.BISHOP:
          legalMoves.push(...GenDiagRayMoves(squares, i, squares[i].color));
          break;
        case PieceType.ROOK:
          legalMoves.push(...GenRayMoves(squares, i, squares[i].color));
          break;
        case PieceType.QUEEN:
          legalMoves.push(...GenDiagRayMoves(squares, i, squares[i].color));
          legalMoves.push(...GenRayMoves(squares, i, squares[i].color));
          break;
        case PieceType.PAWN:
          legalMoves.push(...GenPawnMoves(squares, i, position.enPassantSquare, squares[i].color));
          break;
        case PieceType.EMPTY:
        default:
          break;
      }
    }
  }
  return legalMoves;
};

const GenKnightMoves = (board: Piece[], from: number, color: Color): Move[] => {
  let legalMoves: Move[] = new Array(0);

  return legalMoves;
};

const GenDiagRayMoves = (board: Piece[], from: number, color: Color): Move[] => {
  let legalMoves: Move[] = new Array(0);
  
  return legalMoves;
};

const GenRayMoves = (board: Piece[], from: number, color: Color): Move[] => {
  let legalMoves: Move[] = new Array(0);

  return legalMoves;
};

const GenKingMoves = (board: Piece[], from: number, color: Color, castleState: number[], OpponentMoves: number[]): Move[] => {
  let legalMoves: Move[] = new Array(0);
  

  return legalMoves;
};

const IsKingChecked = (board: Piece[], kingLocation: number, color: Color, OpponentMoves: number[]): boolean => {
  let isChecked: boolean = false;
  
  return isChecked;
};



const GenPawnMoves = (board: Piece[], from: number, enPassantSquare: number | null, color: Color): Move[] => {
  return color === Color.WHITE
    ? GenWhitePawnMoves(board, from, enPassantSquare, color)
    : GenBlackPawnMoves(board, from, enPassantSquare, color);
};

const GenWhitePawnMoves = (board: Piece[], from: number, enPassantSquare: number | null, color: Color): Move[] => {
  let legalMoves: Move[] = new Array(0);
  
  return legalMoves;
};

const GenBlackPawnMoves = (board: Piece[], from: number, enPassantSquare: number | null, color: Color): Move[] => {
  let legalMoves: Move[] = new Array(0);
  return legalMoves;
};
