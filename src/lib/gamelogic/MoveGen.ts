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
	SwitchTo120,
	GetOpponentColor,
} from "./GameHelpers";

export const GenerateMoves = (position: Position): Move[] => {
	let squares = position.squares;
	let legalMoves: Move[] = new Array(0);
	let kingLocation = position.player === Color.WHITE ? position.kingLocations[0] : position.kingLocations[1];

	let [attackingPieces, attackedSquares] = KingCheckSquares(SwitchTo120(squares), CoordinateChange(kingLocation), position.player);
	let inCheck: Boolean = attackingPieces.length > 0 ? true : false;
	//only king can move in double check
	if (attackingPieces.length > 1) {
		return GenKingMoves(squares, kingLocation, position.player, inCheck, position.castleState);
	}
	console.log(inCheck);

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
				case PieceType.KING:
					legalMoves.push(...GenKingMoves(squares, i, squares[i].color, inCheck, position.castleState));
					break;
				case PieceType.EMPTY:
				default:
					break;
			}
		}
	}

	console.log([attackingPieces, attackedSquares]);
	if (attackingPieces.length > 0) {
		legalMoves = InCheckHandler(legalMoves, kingLocation, attackedSquares);
	}
	return legalMoves;
};

const GenKnightMoves = (board: Piece[], from: number, color: Color): Move[] => {
	let legalMoves: Move[] = new Array(0);
	let pseudoLegalMoves: Move[] = new Array(8);
	let board120: Piece[] = SwitchTo120(board);
	let [x, y] = ConvertToXY(from);

	switch (x) {
		case 0:
			pseudoLegalMoves = [
				CreateMove( from, ConvertToIndex(x + 2, y + 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 2, y - 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 1, y - 2), board[from], MoveType.UNKNOWN),
			];
			break;
		case 1:
			pseudoLegalMoves = [
				CreateMove( from, ConvertToIndex(x + 2, y + 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 2, y - 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 1, y - 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y - 2), board[from], MoveType.UNKNOWN),
			];
			break;
		case 6:
			pseudoLegalMoves = [
				CreateMove( from, ConvertToIndex(x + 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 1, y - 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 2, y + 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 2, y - 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y - 2), board[from], MoveType.UNKNOWN),
			];
			break;
		case 7:
			pseudoLegalMoves = [
				CreateMove( from, ConvertToIndex(x - 2, y + 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 2, y - 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y - 2), board[from], MoveType.UNKNOWN),
			];
			break;
		default:
			pseudoLegalMoves = [
				CreateMove( from, ConvertToIndex(x + 2, y + 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 2, y - 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x + 1, y - 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 2, y + 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 2, y - 1), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y + 2), board[from], MoveType.UNKNOWN),
				CreateMove( from, ConvertToIndex(x - 1, y - 2), board[from], MoveType.UNKNOWN),
			];
			break;
	}

	pseudoLegalMoves.forEach((move) => {
		let toIndex120 = CoordinateChange(move.toSquare);
		//if move is on the board check move type
		if (board120[toIndex120].type !== PieceType.BOUNDARY) {
			//if the knight color is not the same as the toSquare piece
			if (board120[toIndex120].color !== color) {
				//opponent king is in check
				if (board120[toIndex120].type === PieceType.KING) {
					move.type = MoveType.CHECK;
					legalMoves.push(move);
				}
				//checks if move is quiet or capture
				if (board120[toIndex120].type === PieceType.EMPTY) {
					move.type = MoveType.QUIET;
					legalMoves.push(move);
				} else {
					move.type = MoveType.CAPTURE;
					legalMoves.push(move);
				}
			}
		}
	});

	return legalMoves;
};

const GenDiagRayMoves = (board: Piece[], from: number, color: Color): Move[] => {
	let legalMoves: Move[] = new Array(0);
	let [x, y] = ConvertToXY(from);
	let fromPiece = board[from];

	while (x < 7 && y < 7) {
		x++;
		y++;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove( from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}

	[x, y] = ConvertToXY(from);

	while (x < 7 && y > 0) {
		x++;
		y--;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove( from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}
	[x, y] = ConvertToXY(from);

	while (x > 0 && y < 7) {
		x--;
		y++;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove( from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}
	[x, y] = ConvertToXY(from);

	while (x > 0 && y > 0) {
		x--;
		y--;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove( from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}

	return legalMoves;
};

const GenRayMoves = (board: Piece[], from: number, color: Color): Move[] => {
	let legalMoves: Move[] = new Array(0);
	let [x, y] = ConvertToXY(from);
	let fromPiece = board[from];

	while (x < 7) {
		x++;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove(from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}
	[x, y] = ConvertToXY(from);

	while (x > 0) {
		x--;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove( from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}
	[x, y] = ConvertToXY(from);

	while (y < 7) {
		y++;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove( from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}
	[x, y] = ConvertToXY(from);
	while (y > 0) {
		y--;
		let index = ConvertToIndex(x, y);
		let moveSquare = board[index];
		let moveType: MoveType;
		if (moveSquare.color === color) {
			break;
		}
		switch (moveSquare.type) {
			case PieceType.EMPTY:
				moveType = MoveType.QUIET;
				break;
			case PieceType.KING:
				moveType = MoveType.CHECK;
				break;
			default:
				moveType = MoveType.CAPTURE;
				break;
		}
		legalMoves.push(CreateMove( from, index, fromPiece, moveType));
		if (moveSquare.type !== PieceType.EMPTY) {
			break;
		}
	}

	return legalMoves;
};

const GenKingMoves = (board: Piece[], from: number, color: Color, inCheck: Boolean, castleState: number[]): Move[] => {
	let legalMoves: Move[] = new Array(0);
	let psuedoMoves: Move[] = new Array(0);
	let [x, y] = ConvertToXY(from);
	let board120: Piece[] = SwitchTo120(board);

	//get psuedo moves
	psuedoMoves = [
		CreateMove( from, ConvertToIndex(x + 1, y + 1), board[from], MoveType.UNKNOWN), //down - right
		CreateMove( from, ConvertToIndex(x + 1, y), board[from], MoveType.UNKNOWN), //right
		CreateMove( from, ConvertToIndex(x + 1, y - 1), board[from], MoveType.UNKNOWN), //up right
		CreateMove( from, ConvertToIndex(x, y + 1), board[from], MoveType.UNKNOWN), //down
		CreateMove( from, ConvertToIndex(x, y - 1), board[from], MoveType.UNKNOWN), //up
		CreateMove( from, ConvertToIndex(x - 1, y + 1), board[from], MoveType.UNKNOWN), //down left
		CreateMove( from, ConvertToIndex(x - 1, y), board[from], MoveType.UNKNOWN), //left
		CreateMove( from, ConvertToIndex(x - 1, y - 1), board[from], MoveType.UNKNOWN), //up left
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
						CreateCastleMove( from, ConvertToIndex(x + 2, y), whiteKingsideRook, ConvertToIndex(rookX - 2, rookY), board[whiteKingStart], MoveType.CASTLE)
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
						CreateCastleMove( from, ConvertToIndex(x - 2, y), whiteQueensideRook, ConvertToIndex(rookX + 3, rookY), board[whiteKingStart], MoveType.CASTLE)
					);
				}
			}
		} else {
			//Black Kingside
			if (castleState[2] === 1 && board120[blackKingStart + 1].type === PieceType.EMPTY && board120[blackKingStart + 2].type === PieceType.EMPTY) {
				if (!IsAttacked(board120, blackKingStart + 1, color) && !IsAttacked(board120, blackKingStart + 2, color)) {
					let [rookX, rookY] = ConvertToXY(blackKingsideRook);
					legalMoves.push(
						CreateCastleMove( from, ConvertToIndex(x + 2, y), blackKingsideRook, ConvertToIndex(rookX - 2, rookY),board[blackKingStart], MoveType.CASTLE)
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
						CreateCastleMove( from, ConvertToIndex(x - 2, y), blackQueensideRook, ConvertToIndex(rookX + 3, rookY),board[blackKingStart], MoveType.CASTLE)
					);
				}
			}
		}
	}
	return legalMoves;
};

const KingCheckSquares = (board: Piece[], kingLocation: number, color: Color): [PieceType[], number[]] => {
	let attackingPieces: PieceType[] = new Array(0);
	let attackedSquares: number[] = new Array(0);
	let diagDirections = [
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
	];
	let straightDirections = [
		[0, 1],
		[0, -1],
		[-1, 0],
		[1, 0],
	];
	let knightMoves = [
		[2, 1],
		[2, -1],
		[1, 2],
		[1, -2],
		[-2, 1],
		[-2, -1],
		[-1, 2],
		[-1, -2],
	];
	let pawnMoves =color === Color.WHITE? [[1, -1],[-1, -1],]: [[1, 1],[-1, 1]];
	
	//check for bishop/queen attacks
	diagDirections.forEach((direction) => {
		let tempAttackedSquares:number[] = [];
		let [x, y] = ConvertTo120XY(kingLocation);
		do{
			x += direction[0];
			y += direction[1];
			if(board[ConvertTo120Index(x, y)].color !== color){
				switch(board[ConvertTo120Index(x, y)].type){
					case PieceType.EMPTY:
						tempAttackedSquares.push(ConvertTo120Index(x, y));
						break;
					case PieceType.BISHOP:
						attackedSquares.push(...tempAttackedSquares);
						attackingPieces.push(PieceType.BISHOP);
						console.log("Bishop Check");
						
						break;
					case PieceType.QUEEN:
						attackedSquares.push(...tempAttackedSquares);
						attackingPieces.push(PieceType.QUEEN);
						console.log("Queen diag Check");
						break;
					default:
						break;
				}
			}else{
				break;
			}
		}while(board[ConvertTo120Index(x, y)].type !== PieceType.BOUNDARY )
	});


	// Check for rook/queen attacks
	straightDirections.forEach((direction) => {
		let tempAttackedSquares:number[] = [];
		let [x, y] = ConvertTo120XY(kingLocation);
		do{
			x += direction[0];
			y += direction[1];
			if(board[ConvertTo120Index(x, y)].color !== color){
				switch(board[ConvertTo120Index(x, y)].type){
					case PieceType.EMPTY:
						tempAttackedSquares.push(ConvertTo120Index(x, y));
						break;
					case PieceType.ROOK:
						attackedSquares.push(...tempAttackedSquares);
						attackingPieces.push(PieceType.ROOK);
						console.log("Rook Check");
						
						break;
					case PieceType.QUEEN:
						attackedSquares.push(...tempAttackedSquares);
						attackingPieces.push(PieceType.QUEEN);
						console.log("Queen straight Check");
						break;
					default:
						break;
				}
			}else{
				break;
			}
		}while(board[ConvertTo120Index(x, y)].type !== PieceType.BOUNDARY )
	});

	// Check if square is under attack by knights
	knightMoves.forEach((direction) => {
		let [x, y] = ConvertTo120XY(kingLocation);
		x += direction[0];
		y += direction[1];
		if (board[ConvertTo120Index(x, y)].type === PieceType.KNIGHT && board[ConvertTo120Index(x, y)].color === GetOpponentColor(color)) {
			attackedSquares.push(ConvertTo120Index(x, y));
			attackingPieces.push(PieceType.KNIGHT);
			console.log("Knight Check");
		}
	})
	// Check if square is under attack by pawns
	pawnMoves.forEach((direction) => {
		let [x, y] = ConvertTo120XY(kingLocation);
		x += direction[0];
		y += direction[1];
		if (board[ConvertTo120Index(x, y)].type === PieceType.PAWN && board[ConvertTo120Index(x, y)].color === GetOpponentColor(color)) {
			attackedSquares.push(ConvertTo120Index(x, y));
			attackingPieces.push(PieceType.PAWN);
			console.log("Pawn Check");
		}
	});

	return [attackingPieces, attackedSquares];
};

//Eliminate moves where king is still in check from originally checking piece.  Only for in check positions.
const InCheckHandler = (legalMoves: Move[], kingLocation: number, attackedSquares: Number[]): Move[] => {
	for (var i = legalMoves.length - 1; i >= 0; i--) {
		let currentMove = legalMoves[i];
		//If king was not moved out of check and the moved piece did not block the check or eliminate the checking piece than remove the move
		if (!attackedSquares.includes(currentMove.toSquare) && !attackedSquares.includes(currentMove.enPassantSquare as number) && currentMove.fromSquare !== kingLocation) {
			legalMoves.splice(i, 1);
		}
	}
	return legalMoves;
};

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
			legalMoves.push(CreateMove( from, from - 8 + 1, board[from], moveType));
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
			legalMoves.push(CreateMove( from, from - 8 - 1, board[from], moveType));
		}
	}

	//one forward
	if (y + 1 < 7 && board[from - 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove( from, from - 8, board[from], MoveType.QUIET));
	} else if (y + 1 === 7 && board[from - 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove( from, from - 8, board[from], MoveType.PROMOTION));
	}

	//two forward
	if (y === 6 && board[from - 16].type === PieceType.EMPTY && board[from - 8].type === PieceType.EMPTY) {
		let to = from - 16;
		let enPassantSquare = from - 8;
		legalMoves.push(CreateMoveTwoSquare( from, to, enPassantSquare, board[from]));
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
			legalMoves.push(CreateMove( from, from + 8 + 1, board[from], moveType));
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
			legalMoves.push(CreateMove( from, from + 8 - 1,board[from], moveType));
		}
	}

	//one forward
	if (y - 1 > 0 && board[from + 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove( from, from + 8, board[from], MoveType.QUIET));
	} else if (y - 1 === 0 && board[from + 8].type === PieceType.EMPTY) {
		legalMoves.push(CreateMove( from, from + 8, board[from], MoveType.PROMOTION));
	}

	//two forward
	if (y === 1 && board[from + 16].type === PieceType.EMPTY && board[from + 8].type === PieceType.EMPTY) {
		let to = from + 16;
		let enPassantSquare = from + 8;
		legalMoves.push(CreateMoveTwoSquare( from, to, enPassantSquare,board[from]));
	}

	return legalMoves;
};

// Return the squares that are under attack and the piece that is attacking
const IsAttacked = (board: Piece[], from: number, color: Color): boolean => {
	let isAttacked = false;
	let diagDirections = [
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
	];
	let straightDirections = [
		[0, 1],
		[0, -1],
		[-1, 0],
		[1, 0],
	];
	let knightMoves = [
		[2, 1],
		[2, -1],
		[1, 2],
		[1, -2],
		[-2, 1],
		[-2, -1],
		[-1, 2],
		[-1, -2],
	];
	let pawnMoves = color === Color.WHITE ? [[1, -1],[-1, -1],]: [[1, 1],[-1, 1],];
	let kingMoves = [
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
		[0, 1],
		[0, -1],
		[-1, 0],
		[1, 0],
	];

	//check for bishop/queen attacks
	diagDirections.forEach((direction) => {
		let [x, y] = ConvertTo120XY(from);
		do {
			x += direction[0];
			y += direction[1];
			if (board[ConvertTo120Index(x, y)].color !== color) {
				switch (board[ConvertTo120Index(x, y)].type) {
					case PieceType.BISHOP:
					case PieceType.QUEEN:
						isAttacked = true;
						break;
					default:
						break;
				}
			}
		} while (board[ConvertTo120Index(x, y)].type !== PieceType.BOUNDARY && board[ConvertTo120Index(x, y)].color !== GetOpponentColor(color));
	});

	// Check for rook/queen attacks
	straightDirections.forEach((direction) => {
		let [x, y] = ConvertTo120XY(from);
		do {
			x += direction[0];
			y += direction[1];
			if (board[ConvertTo120Index(x, y)].color !== color) {
				switch (board[ConvertTo120Index(x, y)].type) {
					case PieceType.ROOK:
					case PieceType.QUEEN:
						isAttacked = true;
						break;
					default:
						break;
				}
			}
		} while (board[ConvertTo120Index(x, y)].type !== PieceType.BOUNDARY && board[ConvertTo120Index(x, y)].color !== GetOpponentColor(color));
	});

	// Check if square is under attack by knights
	knightMoves.forEach((direction) => {
		let [x, y] = ConvertTo120XY(from);
		x += direction[0];
		y += direction[1];
		if (board[ConvertTo120Index(x, y)].type === PieceType.KNIGHT && board[ConvertTo120Index(x, y)].color === color) {
			isAttacked = true;
		}
	});

	// Check if square is under attack by pawns
	pawnMoves.forEach((direction) => {
		let [x, y] = ConvertTo120XY(from);
		x += direction[0];
		y += direction[1];
		if (board[ConvertTo120Index(x, y)].type === PieceType.PAWN && board[ConvertTo120Index(x, y)].color !== color) {
			isAttacked = true;
		}
	});

	// Check if square is under attack by king.
	kingMoves.forEach((direction) => {
		let [x, y] = ConvertTo120XY(from);
		x += direction[0];
		y += direction[1];
		if (board[ConvertTo120Index(x, y)].type === PieceType.KING && board[ConvertTo120Index(x, y)].color !== color) {
			isAttacked = true;
		}
	});

	return isAttacked;
};
