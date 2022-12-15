import { PieceType, Color, MoveType } from "../enums/GameEnums";
import { CreatePosition } from "./GameHelpers";
import { GenKnightMoves } from "./MoveGen";

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
	if (piece.type === PieceType.KING) {
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
	if (piece.type === PieceType.ROOK && !board[from].hasMoved) {
		if (from === wkRook) {
			castleState[0] = 0;
		} else if (from === wqRook) {
			castleState[1] = 0;
		} else if (from === bkRook) {
			castleState[2] = 0;
		} else if (from === bqRook) {
			castleState[3] = 0;
		}
	}
	// Change castling states for rooks being captured
	if (board[to].type === PieceType.ROOK && move.type === MoveType.CAPTURE) {
		if (to === wkRook) {
			castleState[0] = 0;
		} else if (to === wqRook) {
			castleState[1] = 0;
		} else if (to === bkRook) {
			castleState[2] = 0;
		} else if (to === bqRook) {
			castleState[3] = 0;
		}
	}

	//Promotion
	//if (move.promotion_piece !== null) {
	//    piece = move.promotion_piece;
	//    if (piece.player === 'white') {
	//        material_balance = material_balance + piece_scores[piece.name] - 1;
	//    }
	//    else {
	//        material_balance = material_balance - piece_scores[piece.name] + 1;
	//    }
	//}

	//Material balance
	//let location_score = square_values[piece.name][end] - square_values[piece.name][start];
	//if (piece.player === 'white') {
	//    material_balance = material_balance + location_score;
	//}
	//else {
	//    material_balance = material_balance - location_score;
	//}

	//swap piece to new location
	board[from].type = PieceType.EMPTY;
	board[from].color = Color.NONE;

	piece.hasMoved = true;
	board[to] = piece;

	player === Color.WHITE ? (player = Color.BLACK) : (player = Color.WHITE);

	return CreatePosition(player, board, castleState, kingLocations, enPassantSquare);
};

/**
 *
 *
 * @export
 * @class Queue
 */
export class Queue<T> {
	list: T[];

	/**
	 *Creates an instance of Queue.
	 * @memberof Queue
	 */
	constructor() {
		this.list = [];
	}

	/**
	 * @param {*} item
	 * @return {Queue}
	 * @memberof Queue
	 */
	enqueue(item: T): Queue<T> {
		this.list = [...this.list, item];
		return this;
	}

	/**
	 *
	 *
	 * @return {Queue}
	 * @memberof Queue
	 */
	dequeue(): T {
		const item = this.list[0];
		this.list = this.list.slice(1);
		return item;
	}

	/**
	 * @return {boolean}
	 * @memberof Queue
	 */
	isEmpty(): boolean {
		return this.list.length === 0;
	}

	/**
	 * @return {number}
	 * @memberof Queue
	 */
	getLength(): number {
		return this.list.length;
	}

	/**
	 * @return {string}
	 * @memberof Queue
	 */
	toString(): string {
		return this.list.toString();
	}
}

export const FindShortestNumKnightMoves = ( board:Piece[], from: number, destination: number, currPlayer: Color): number =>  {
    let q = new Queue<[Move , number]>();
    let visited:number[] = [];
    let dist = 1;
    let startMoves = GenKnightMoves(board, from, currPlayer);

    startMoves.forEach(move =>{
        q.enqueue([move, dist])
    })

    while(!q.isEmpty()){
        let currMove = q.dequeue();
        if(currMove[0].fromSquare === destination){
            return currMove[1];
        }

        if(!visited.includes(currMove[0].fromSquare)){
            // mark the current node as visited
            visited.push(currMove[0].fromSquare)
            // check for all eight possible movements for a knight
            // and enqueue each valid movement
            let moves = GenKnightMoves(board, currMove[0].toSquare, currPlayer);
            moves.forEach(move =>{
                q.enqueue([move, dist+1]);
            })
        }
    }
    
    return -1;
};
