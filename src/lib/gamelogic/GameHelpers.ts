import { PieceType, Color, MoveType } from "../enums/GameEnums";

export const CreatePiece = (type: PieceType, color: Color): Piece => {
	return {
		type: type,
		color: color,
	};
};

export const CreateMove = (player: Color, fromSquare: number, toSquare: number, piece: PieceType, moveType: MoveType): Move => {
	return {
		player: player,
		fromSquare: fromSquare,
		toSquare: toSquare,
		enPassantSquare: null,
		promotedPiece: null,
		rookStart: null,
		rookEnd: null,
		piece: piece,
		type: moveType,
	};
};

export const CreateMoveTwoSquare = (player: Color, fromSquare: number, toSquare: number, enPassantSquare: number, piece: PieceType, moveType: MoveType): Move => {
	return {
		player: player,
		fromSquare: fromSquare,
		toSquare: toSquare,
		enPassantSquare: enPassantSquare,
		promotedPiece: null,
		rookStart: null,
		rookEnd: null,
		piece: piece,
		type: moveType,
	};
};

export const CreatePromotionMove = (player: Color, fromSquare: number, toSquare: number, enPassantSquare: number, promotedPiece: Piece, piece: PieceType, moveType: MoveType): Move => {
	return {
		player: player,
		fromSquare: fromSquare,
		toSquare: toSquare,
		enPassantSquare: enPassantSquare,
		promotedPiece: promotedPiece,
		rookStart: null,
		rookEnd: null,
		piece: piece,
		type: moveType,
	};
};

export const CreateCastleMove = (player: Color, fromSquare: number, toSquare: number,rookStart: number,rookEnd: number, piece: PieceType, moveType: MoveType): Move => {
	return {
		player: player,
		fromSquare: fromSquare,
		toSquare: toSquare,
		enPassantSquare: null,
		promotedPiece: null,
		rookStart: rookStart,
		rookEnd: rookEnd,
		piece: piece,
		type: moveType,
	};
};

export const CreatePosition = (player: Color, squares: Piece[], castleState: number[], kingLocations: number[], enPassantSquare: number | null): Position => {
	return {
		player: player,
		squares: squares,
		castleState: castleState,
		kingLocations: kingLocations,
		enPassantSquare: enPassantSquare,
	};
};

export const CreateInitialGame = (): ChessGame => {
	let position = ParseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ");

	return {
		history: [position],
		currPosition: position,
		moveList: new Array(0),
		whiteCaptured: new Array(0),
		blackCaptured: new Array(0),
		moveNum: 1,
	};
};

const CreateBlankBoard = (): Position => {
	let squares: Piece[] = new Array(64);

	squares.forEach((sq) => {
		sq = CreatePiece(PieceType.EMPTY, Color.NONE);
	});

	return CreatePosition(Color.WHITE, squares, [0, 0, 0, 0], [0, 0], null);
};

export const ParseFen = (fen: string): Position => {
	if (fen.length === 0) {
		return CreateBlankBoard();
	}

	let squares: Piece[] = new Array(64);
	squares.forEach((sq) => {
		sq = CreatePiece(PieceType.EMPTY, Color.NONE);
	});

	let player: Color = Color.NONE;
	let castle_state = [0, 0, 0, 0];
	let enPassantSquare = null;

	var rank = 0;
	var file = 0;
	var piece: Piece;
	var count = 0;
	var i = 0;
	var sq64 = 0;
	var fenCnt = 0; // fen[fenCnt]

	while (rank <= 7 && fenCnt < fen.length) {
		count = 1;
		switch (fen[fenCnt]) {
			case "p":
				piece = CreatePiece(PieceType.PAWN, Color.BLACK);
				break;
			case "r":
				piece = CreatePiece(PieceType.ROOK, Color.BLACK);
				break;
			case "n":
				piece = CreatePiece(PieceType.KNIGHT, Color.BLACK);
				break;
			case "b":
				piece = CreatePiece(PieceType.BISHOP, Color.BLACK);
				break;
			case "k":
				piece = CreatePiece(PieceType.KING, Color.BLACK);
				break;
			case "q":
				piece = CreatePiece(PieceType.QUEEN, Color.BLACK);
				break;
			case "P":
				piece = CreatePiece(PieceType.PAWN, Color.WHITE);
				break;
			case "R":
				piece = CreatePiece(PieceType.ROOK, Color.WHITE);
				break;
			case "N":
				piece = CreatePiece(PieceType.KNIGHT, Color.WHITE);
				break;
			case "B":
				piece = CreatePiece(PieceType.BISHOP, Color.WHITE);
				break;
			case "K":
				piece = CreatePiece(PieceType.KING, Color.WHITE);
				break;
			case "Q":
				piece = CreatePiece(PieceType.QUEEN, Color.WHITE);
				break;

			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
				piece = CreatePiece(PieceType.EMPTY, Color.NONE);
				count = fen[fenCnt].charCodeAt(0) - "0".charCodeAt(0);
				break;

			case "/":
			case " ":
				rank = rank + 1;
				file = 0;
				fenCnt = fenCnt + 1;
				continue;
			default:
				return CreateBlankBoard();
		}
		for (i = 0; i < count; i++) {
			sq64 = rank * 8 + file;
			squares[sq64] = piece;
			file++;
		}
		fenCnt++;
	} // while loop end

	//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	player = fen[fenCnt] === "w" ? Color.WHITE : Color.BLACK;
	fenCnt += 2;

	for (i = 0; i < 4; i++) {
		if (fen[fenCnt] === " ") {
			break;
		}
		switch (fen[fenCnt]) {
			case "K":
				castle_state[0] = 1;
				break;
			case "Q":
				castle_state[1] = 1;
				break;
			case "k":
				castle_state[2] = 1;
				break;
			case "q":
				castle_state[3] = 1;
				break;
			default:
				break;
		}
		fenCnt++;
	}
	fenCnt++;

	if (fen[fenCnt] !== "-") {
		file = fen[fenCnt].charCodeAt(0) - "a".charCodeAt(0);
		rank = fen[fenCnt + 1].charCodeAt(0) - "1".charCodeAt(0);
		enPassantSquare = ConvertToIndex(file, 7 - rank);
	}
	let kingLocations: number[] = GetKingLocations(squares);
	let position = CreatePosition(player, squares, castle_state, kingLocations, enPassantSquare);
	//set_pawn_states(position);
	return position;
};

export const GetKingLocations = (squares: Piece[]): number[] => {
	let pieceCnt = 0;
	let kingLocations: number[] = new Array(2);
	squares.forEach((sq) => {
		if (sq.type === PieceType.KING) {
			if (sq.color === Color.WHITE) {
				kingLocations[0] = pieceCnt;
			} else {
				kingLocations[1] = pieceCnt;
			}
		}
		pieceCnt++;
	});
	return kingLocations;
};

export const SwitchTo120 = (board64: Piece[]): Piece[] => {
	let board120: Piece[] = new Array(120);
	let count = 0;
	let index = 0;

	for (var i = 0; i < 12; i++) {
		for (var y = 0; y < 10; y++) {
			/*if boundary square*/
			index = i * 10 + y;
			if (y === 0 || y === 9 || i === 0 || i === 1 || i === 10 || i === 11) {
				board120[index] = CreatePiece(PieceType.BOUNDARY, Color.NONE);
			} else {
				board120[index] = board64[count];
				count = count + 1;
			}
		}
	}
	return board120;
};

export const SwitchTo64 = (board120: Piece[]): Piece[] => {
	let board64: Piece[] = new Array(64);
	let count = 0;
	let index = 0;

	for (var i = 0; i < 12; i++) {
		for (var y = 0; y < 10; y++) {
			/*if boundary square*/
			index = i * 10 + y;
			if (y === 0 || y === 9 || i === 0 || i === 1 || i === 10 || i === 11) {
				//do nothing
			} else {
				board64[count] = board120[index];
				count = count + 1;
			}
		}
	}
	return board64;
};

export const InverseCoordinateChange = (sq120: number): number => {
	let sq64 = sq120 - 17 - Math.floor(sq120 / 10) * 2;
	return sq64;
};

export const CoordinateChange = (sq64: number): number => {
	let sq120 = sq64 + 21 + Math.floor(sq64 / 8) * 2;
	return sq120;
};

export const ConvertToXY = (index: number): [x: number, y: number] => {
	let x = index % 8;
	let y = Math.floor(index / 8);
	return [x, y];
};

export const ConvertToIndex = (x: number, y: number): number => {
	return x + y * 8;
};
