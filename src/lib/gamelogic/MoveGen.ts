import { PieceType, Color, MoveType } from "../enums/GameEnums";
import {
	ConvertToIndex,
	ConvertToXY,
	ConvertTo120XY,
	ConvertTo120Index,
	CoordinateChange,
	CreateMove,
	CreateMoveTwoSquare,
	CreateCastleMove,
	CreatePromotionMove,
	CreatePiece,
	CreatePosition,
	SwitchTo120,
	InverseCoordinateChange,
} from "./GameHelpers";

export const GenerateMoves = (position: Position): Move[] => {
	let squares = position.squares;
	let legalMoves: Move[] = new Array(0);
	let kingLocation = position.player === Color.WHITE ? position.kingLocations[0] : position.kingLocations[1];

	let [attackingPieces, attackedSquares] = KingCheckSquares(squares, kingLocation, position.player);
	let inCheck: Boolean = attackingPieces.length > 0 ? true : false;

	//only king can move in double check
	if (attackingPieces.length > 1) {
		return GenKingMoves(squares, kingLocation, position.player, inCheck, position.castleState);
	}

	for (let i = 0; i < 64; i++) {
		if (position.player === squares[i].color) {
			switch (squares[i].type) {
				case PieceType.KNIGHT:
					//legalMoves.push(...GenKnightMoves(squares, i, squares[i].color));
					break;
				case PieceType.BISHOP:
					//legalMoves.push(...GenDiagRayMoves(squares, i, squares[i].color));
					break;
				case PieceType.ROOK:
					//legalMoves.push(...GenRayMoves(squares, i, squares[i].color));
					break;
				case PieceType.QUEEN:
					//legalMoves.push(...GenDiagRayMoves(squares, i, squares[i].color));
					//legalMoves.push(...GenRayMoves(squares, i, squares[i].color));
					break;
				case PieceType.PAWN:
					legalMoves.push(...GenPawnMoves(squares, i, position.enPassantSquare, squares[i].color));
					break;
				case PieceType.KING:
					legalMoves.push(...GenKingMoves(squares, i, squares[i].color, inCheck, position.castleState));
					break;
				case PieceType.EMPTY:
				default:
					break;
			}
		}
	}

	if (attackingPieces.length > 0) {
		legalMoves = InCheckHandler(legalMoves, kingLocation, attackedSquares);
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

const GenKingMoves = (board: Piece[], from: number, color: Color, inCheck: Boolean, castleState: number[]): Move[] => {
	let legalMoves: Move[] = new Array(0);
	let psuedoMoves: Move[] = new Array(0);
	let [x, y] = ConvertToXY(from);
	//Take King off the board for calculating normal move attacking squares
	let board120: Piece[] = SwitchTo120(board);

	//get psuedo moves
	psuedoMoves = [
		CreateMove(color, from, ConvertToIndex(x + 1, y + 1), PieceType.KING, MoveType.UNKNOWN), //down - right
		CreateMove(color, from, ConvertToIndex(x + 1, y), PieceType.KING, MoveType.UNKNOWN), //right
		CreateMove(color, from, ConvertToIndex(x + 1, y - 1), PieceType.KING, MoveType.UNKNOWN), //up right
		CreateMove(color, from, ConvertToIndex(x, y + 1), PieceType.KING, MoveType.UNKNOWN), //down
		CreateMove(color, from, ConvertToIndex(x, y - 1), PieceType.KING, MoveType.UNKNOWN), //up
		CreateMove(color, from, ConvertToIndex(x - 1, y + 1), PieceType.KING, MoveType.UNKNOWN), //down left
		CreateMove(color, from, ConvertToIndex(x - 1, y), PieceType.KING, MoveType.UNKNOWN), //left
		CreateMove(color, from, ConvertToIndex(x - 1, y - 1), PieceType.KING, MoveType.UNKNOWN), //up left
	];

	// Regular Moves (non castling)
	psuedoMoves.forEach((move) => {
		let toIndex120 = CoordinateChange(move.toSquare);
		//Empty Squares
		if (board120[toIndex120].type === PieceType.EMPTY && !IsAttacked(board120, toIndex120, color)) {
			move.type = MoveType.QUIET;
			legalMoves.push(move);
		} else if (board120[toIndex120].type !== PieceType.BOUNDARY && board120[toIndex120].color !== color && !IsAttacked(board120, toIndex120, color)) {
			// Capture
			move.type = MoveType.CAPTURE;
			legalMoves.push(move);
		}
	});

	// Castling
	let whiteKingsideRook = 98;
	let whiteQueensideRook = 91;
	let blackKingsideRook = 28;
	let blackQueensideRook = 21;
	let whiteKingStart = 95;
	let blackKingStart = 25;

	if (!inCheck) {
		// White Kingside
		if ((color = Color.WHITE)) {
			if (castleState[0] === 1 && board120[whiteKingStart + 1].type === PieceType.EMPTY && board120[whiteKingStart + 2].type === PieceType.EMPTY) {
				if (!IsAttacked(board120, whiteKingStart + 1, color) && !IsAttacked(board120, whiteKingStart + 2, color)) {
					let [rookX, rookY] = ConvertToXY(whiteKingsideRook);
					legalMoves.push(
						CreateCastleMove(color, from, ConvertToIndex(x + 2, y), whiteKingsideRook, ConvertToIndex(rookX - 2, rookY), PieceType.KING, MoveType.CASTLE)
					);
				}
			}
			// White Queenside
			if (
				castleState[1] === 1 &&
				board120[whiteKingStart - 1].type === PieceType.EMPTY &&
				board120[whiteKingStart - 2].type === PieceType.EMPTY &&
				board120[whiteKingStart - 3].type === PieceType.EMPTY
			) {
				if (!IsAttacked(board120, whiteKingStart - 1, color) && !IsAttacked(board120, whiteKingStart - 2, color)) {
					let [rookX, rookY] = ConvertToXY(whiteQueensideRook);
					legalMoves.push(
						CreateCastleMove(color, from, ConvertToIndex(x - 2, y), whiteQueensideRook, ConvertToIndex(rookX + 3, rookY), PieceType.KING, MoveType.CASTLE)
					);
				}
			}
		} else {
			//Black Kingside
			if (castleState[2] === 1 && board120[blackKingStart + 1].type === PieceType.EMPTY && board120[blackKingStart + 2].type === PieceType.EMPTY) {
				if (!IsAttacked(board120, blackKingStart + 1, color) && !IsAttacked(board120, blackKingStart + 2, color)) {
					let [rookX, rookY] = ConvertToXY(blackKingsideRook);
					legalMoves.push(
						CreateCastleMove(color, from, ConvertToIndex(x + 2, y), blackKingsideRook, ConvertToIndex(rookX - 2, rookY), PieceType.KING, MoveType.CASTLE)
					);
				}
			}
			//Black Queenside
			if (
				castleState[3] === 1 &&
				board120[blackKingStart - 1].type === PieceType.EMPTY &&
				board120[blackKingStart - 2].type === PieceType.EMPTY &&
				board120[blackKingStart - 3].type === PieceType.EMPTY
			) {
				if (!IsAttacked(board120, blackKingStart - 1, color) && !IsAttacked(board120, blackKingStart - 2, color)) {
					let [rookX, rookY] = ConvertToXY(blackQueensideRook);
					legalMoves.push(
						CreateCastleMove(color, from, ConvertToIndex(x - 2, y), blackQueensideRook, ConvertToIndex(rookX + 3, rookY), PieceType.KING, MoveType.CASTLE)
					);
				}
			}
		}
	}
	return legalMoves;
};

const KingCheckSquares = (board: Piece[], kingLocation: number, color: Color): [Piece[], number[]] => {
	let attackingPieces: Piece[] = new Array(0);
	let attackedSquares: number[] = new Array(0);

	return [attackingPieces, attackedSquares];
};
/*

let up_right = right(1, forward(1, king_location, player), player);
let up_left = left(1, forward(1, king_location, player), player);

let pawn_moves = [up_right, up_left];
let knight_moves = get_knight_moves(king_location, player);
let diagDirections = [
[1, 1],
[-1, 1],
[1, -1],
[-1, -1],
];
let straight_directions = [
[0, 1],
[0, -1],
[-1, 0],
[1, 0],
];

//get bishop/queen attack squares
for (var i = 0; i < diagDirections.length; i++) {
    let [attack_squares, attack_piece] = attacked_squares(squares, diagDirections[i], king_location, player, ["Queen", "Bishop"]);
    if (attack_piece !== null) {
        checked_squares = checked_squares.concat(attack_squares);
        attackingPieces.push(attack_piece);
    }
}
// Check for rook/queen attacks
for (i = 0; i < straight_directions.length; i++) {
    let [attack_squares, attack_piece] = attacked_squares(squares, straight_directions[i], king_location, player, ["Queen", "Rook"]);
    if (attack_piece !== null) {
        checked_squares = checked_squares.concat(attack_squares);
        attackingPieces.push(attack_piece);
    }
}

// Check if square is under attack by knights
for (i = 0; i < knight_moves.length; i++) {
    let end_piece = squares[knight_moves[i]];
    if (end_piece !== "boundary" && end_piece !== null) {
        if (end_piece.player !== player && end_piece.name === "Knight") {
            checked_squares = checked_squares.concat([knight_moves[i]]);
            attackingPieces.push(end_piece);
        }
    }
}
// Check if square is under attack by pawns
for (i = 0; i < pawn_moves.length; i++) {
    let end_piece = squares[pawn_moves[i]];
    if (end_piece !== "boundary" && end_piece !== null) {
        if (end_piece.player !== player && end_piece.name === "Pawn") {
            checked_squares = checked_squares.concat([pawn_moves[i]]);
            attackingPieces.push(end_piece);
        }
    }
}

return [attackingPieces, checked_squares];
}
*/

const InCheckHandler = (legalMoves: Move[], kingLocation: number, attackedSquares: Number[]): Move[] => {
	return legalMoves;
};
/* Eliminate moves where king is still in check from originally checking piece.  Only for in check positions.
function in_check_handler(legal_moves, king_location, attacked_squares) {
    for (var i = legal_moves.length - 1; i >= 0; i--) {
      let current_move = legal_moves[i];
       If king was not moved out of check and the moved piece did not block the check or eliminate the checking piece than remove the move 
      if (
        !attacked_squares.includes(current_move.end) &&
        !attacked_squares.includes(current_move.en_passant_capture) &&
        current_move.start !== king_location
      ) {
        legal_moves.splice(i, 1);
      }
    }
    return legal_moves;
  }
  */

const GenPawnMoves = (board: Piece[], from: number, enPassantSquare: number | null, color: Color): Move[] => {
	return color === Color.WHITE ? GenWhitePawnMoves(board, from, enPassantSquare, color) : GenBlackPawnMoves(board, from, enPassantSquare, color);
};

const GenWhitePawnMoves = (board: Piece[], from: number, enPassantSquare: number | null, color: Color): Move[] => {
	let legalMoves: Move[] = new Array(0);
	let [x, y] = ConvertToXY(from);

	//diagonal kill
	if (x < 7 && y > 0) {
		//right attack
		let diagSquare = board[from - 8 + 1];
		if (diagSquare.color !== color && (diagSquare.type !== PieceType.EMPTY || enPassantSquare === from - 8 + 1)) {
			let moveType: MoveType;
			if (enPassantSquare === from - 8 + 1) {
				moveType = MoveType.ENPASSANT;
			} else if (diagSquare.type === PieceType.KING) {
				moveType = MoveType.CHECK;
			} else {
				moveType = MoveType.CAPTURE;
			}
			legalMoves.push(CreateMove(color, from, from - 8 + 1, PieceType.PAWN, moveType));
		}
	}
	if (x > 0 && y > 0) {
		//left attack
		let diagSquare = board[from - 8 - 1];
		if (diagSquare.color !== color && (diagSquare.type !== PieceType.EMPTY || enPassantSquare === from - 8 - 1)) {
			let moveType: MoveType;

			if (enPassantSquare === from - 8 - 1) {
				moveType = MoveType.ENPASSANT;
			} else if (y + 1 === 7) {
				moveType = MoveType.PROMOTION_CAPTURE;
			} else {
				switch (diagSquare.type) {
					case PieceType.KING:
						moveType = MoveType.CHECK;
						break;
					default:
						moveType = MoveType.CAPTURE;
						break;
				}
			}
			legalMoves.push(CreateMove(color, from, from - 8 - 1, PieceType.PAWN, moveType));
		}
	}

	//one forward
	if (y + 1 < 7 && board[from - 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove(color, from, from - 8, PieceType.PAWN, MoveType.QUIET));
	} else if (y + 1 === 7 && board[from - 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove(color, from, from - 8, PieceType.PAWN, MoveType.PROMOTION));
	}

	//two forward
	if (y === 6 && board[from - 16].type === PieceType.EMPTY && board[from - 8].type === PieceType.EMPTY) {
		let to = from - 16;
		let enPassantSquare = from - 8;
		legalMoves.push(CreateMoveTwoSquare(color, from, to, enPassantSquare, PieceType.PAWN, MoveType.PROMOTION));
	}

	return legalMoves;
};

const GenBlackPawnMoves = (board: Piece[], from: number, enPassantSquare: number | null, color: Color): Move[] => {
	let legalMoves: Move[] = new Array(0);
	let [x, y] = ConvertToXY(from);

	//diagonal kill
	if (y < 7 && x < 7) {
		//right attack
		let diagSquare = board[from + 8 + 1];
		if (diagSquare.color !== color && (diagSquare.type !== PieceType.EMPTY || enPassantSquare === from + 8 + 1)) {
			let moveType: MoveType;
			if (enPassantSquare === from + 8 + 1) {
				moveType = MoveType.ENPASSANT;
			} else if (diagSquare.type === PieceType.KING) {
				moveType = MoveType.CHECK;
			} else {
				moveType = MoveType.CAPTURE;
			}
			legalMoves.push(CreateMove(color, from, from + 8 + 1, PieceType.PAWN, moveType));
		}
	}
	if (x > 0 && y < 7) {
		//left attack
		let diagSquare = board[from + 8 - 1];
		if (diagSquare.color !== color && (diagSquare.type !== PieceType.EMPTY || enPassantSquare === from + 8 - 1)) {
			let moveType: MoveType;
			if (enPassantSquare === from + 8 - 1) {
				moveType = MoveType.ENPASSANT;
			} else if (y - 1 === 0) {
				moveType = MoveType.PROMOTION_CAPTURE;
			} else {
				switch (diagSquare.type) {
					case PieceType.KING:
						moveType = MoveType.CHECK;
						break;
					default:
						moveType = MoveType.CAPTURE;
						break;
				}
			}
			legalMoves.push(CreateMove(color, from, from + 8 - 1, PieceType.PAWN, moveType));
		}
	}

	//one forward
	if (y - 1 > 0 && board[from + 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove(color, from, from + 8, PieceType.PAWN, MoveType.QUIET));
	} else if (y - 1 === 0 && board[from + 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove(color, from, from + 8, PieceType.PAWN, MoveType.PROMOTION));
	}

	//two forward
	if (y === 1 && board[from + 16].type === PieceType.EMPTY && board[from + 8].type === PieceType.EMPTY) {
		let to = from + 16;
		let enPassantSquare = from + 8;
		legalMoves.push(CreateMoveTwoSquare(color, from, to, enPassantSquare, PieceType.PAWN, MoveType.PROMOTION));
	}

	return legalMoves;
};

// Return the squares that are under attack and the piece that is attacking
const IsAttacked = (board: Piece[], from: number, color: Color): boolean => {
	let isAttacked = false;
	let diagDirections = [[1, 1],[-1, 1],[1, -1],[-1, -1]];
	let straightDirections = [[0, 1],[0, -1],[-1, 0],[1, 0]];
	let knightMoves = [[2,1],[2,-1],[1,2],[1,-2],[-2,1],[-2,-1],[-1,2],[-1,-2]];
	let pawnMoves = (color === Color.WHITE) ? [[1, -1],[-1, -1]] : [[1, 1],[-1, 1]];
	let kingMoves = [[1, 1],[-1, 1],[1, -1],[-1, -1],[0, 1],[0, -1],[-1, 0],[1, 0]];

	//check for bishop/queen attacks
	diagDirections.forEach(direction => {
		let [x, y] = ConvertTo120XY(from);
		do {
			x += direction[0];
			y += direction[1];
			if(board[ConvertTo120Index(x, y)].color !== color){
				switch (board[ConvertTo120Index(x, y)].type) {
					case PieceType.BISHOP:
					case PieceType.QUEEN:
						isAttacked = true;
						break;
					default:
						break;
				}
			}
		} while (board[ConvertTo120Index(x, y)].type !== PieceType.BOUNDARY);
	})
		
	// Check for rook/queen attacks
	straightDirections.forEach(direction => {
		let [x, y] = ConvertTo120XY(from);
		do {
			x += direction[0];
			y += direction[1];
			if(board[ConvertTo120Index(x, y)].color !== color){
				switch (board[ConvertTo120Index(x, y)].type) {
					case PieceType.ROOK:
					case PieceType.QUEEN:
						isAttacked = true;
						break;
					default:
						break;
				}
			}
		} while (board[ConvertTo120Index(x, y)].type !== PieceType.BOUNDARY);
	})

	// Check if square is under attack by knights
	knightMoves.forEach(direction => {
		let [x, y] = ConvertTo120XY(from);
		x += direction[0];
		y += direction[1];
		if(board[ConvertTo120Index(x, y)].type === PieceType.KNIGHT && board[ConvertTo120Index(x, y)].color !== color){
			isAttacked = true;
		}
	})

	// Check if square is under attack by pawns
	pawnMoves.forEach(direction => {
		let [x, y] = ConvertTo120XY(from);
		x += direction[0];
		y += direction[1];
		if(board[ConvertTo120Index(x, y)].type === PieceType.PAWN && board[ConvertTo120Index(x, y)].color !== color){
			isAttacked = true;
		}
	})

	// Check if square is under attack by king.
	kingMoves.forEach(direction => {
		let [x, y] = ConvertTo120XY(from);
		x += direction[0];
		y += direction[1];
		if(board[ConvertTo120Index(x, y)].type === PieceType.KING && board[ConvertTo120Index(x, y)].color !== color){
			isAttacked = true;
		}
	})

	return isAttacked;
};
