import { PieceType, Color, MoveType } from "../enums/GameEnums";
import { CreatePosition } from "./GameHelpers";

export const MakeMove = (position: Position, move: Move): Position => {
	let from = move.fromSquare;
	let to = move.toSquare;

	//Starting Rook Locations
	let wkRook = 98;
	let wqRook = 91;
	let bkRook = 28;
	let bqRook = 21;

	let player = position.player;

	let board = position.squares.slice();
	let piece = move.piece;
    let kingLocations = position.kingLocations;
	let castleState = position.castleState;
    let enPassantSquare = null;

	//remove the en passantable pawn from board
	if (move.type === MoveType.ENPASSANT) {
		let enPassantPawnIndex = position.player === Color.WHITE ? move.toSquare - 8 : move.toSquare + 8;
		board[enPassantPawnIndex].type = PieceType.EMPTY;
		board[enPassantPawnIndex].color = Color.NONE;
	}

	//Add en passant square for pawn move 2
	if (move.type === MoveType.PAWN_MOVE_TWO) {
		enPassantSquare = position.player === Color.WHITE ? move.toSquare + 8 : move.toSquare - 8;
	}

	// Castling move
	if (move.type === MoveType.CASTLE) {
		board[move.rookStart as number].color = Color.NONE;
		board[move.rookStart as number].type = PieceType.EMPTY;
		board[move.rookEnd as number].color = player;

		board[move.rookEnd as number].type = PieceType.ROOK;
		board[move.rookEnd as number].hasMoved = true;
	}

	// Change King Location and Castling states
	if (piece === PieceType.KING) {
		if (player === Color.WHITE) {
			kingLocations[0] = to;
			castleState[0] = 0;
			castleState[1] = 0;
		} else {
			kingLocations[1] = to;
			castleState[2] = 0;
			castleState[3] = 0;
		}
	}

	// Change castling states for rook first moves
    if(piece === PieceType.ROOK && !board[from].hasMoved)
    {
        if (from === wkRook) {
            castleState[0] = 0;
        }
        else if (from === wqRook) {
            castleState[1] = 0;
        }
        else if (from === bkRook) {
            castleState[2] = 0;
        }
        else if (from === bqRook) {
            castleState[3] = 0;
        }
    }
	// Change castling states for rooks being captured
    if(board[to].type === PieceType.ROOK && move.type === MoveType.CAPTURE){
        if (to === wkRook) {
            castleState[0] = 0;
        }
        else if (to === wqRook) {
            castleState[1] = 0;
        }
        else if (to === bkRook) {
            castleState[2] = 0;
        }
        else if (to === bqRook) {
            castleState[3] = 0;
        }
    }

    //Change material Balance

    //Handle promotion

    //swap piece to new location
    board[from].type = PieceType.EMPTY;
    board[from].color = Color.NONE;

    board[to].type = move.piece;
    board[to].color = player;
    board[to].hasMoved = true;

    (player === Color.WHITE)? player = Color.BLACK : player = Color.WHITE;

	return CreatePosition(player,board,castleState,kingLocations,enPassantSquare);
};

/*
    
   

    //Promotion
    if (move.promotion_piece !== null) {
        piece = move.promotion_piece;
        if (piece.player === 'white') {
            material_balance = material_balance + piece_scores[piece.name] - 1;
        }
        else {
            material_balance = material_balance - piece_scores[piece.name] + 1;
        }
    }

    let location_score = square_values[piece.name][end] - square_values[piece.name][start];
    if (piece.player === 'white') {
        material_balance = material_balance + location_score;
    }
    else {
        material_balance = material_balance - location_score;
    }

    squares[start] = null;
    squares[end] = piece;
    piece.has_moved = true;

    (player === 'white') ? player = 'black' : player = 'white';

    return new Position(player, squares, king_locations, castle_state, material_balance, en_passant_square);
    */
