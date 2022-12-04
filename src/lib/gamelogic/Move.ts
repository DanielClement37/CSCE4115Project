import { PieceType, Color, MoveType } from "../enums/GameEnums";

export const MakeMove = (position: Position, move: Move):Position=>{
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
    let castleState = position.castleState;
    let enPassantSquare = null;

    //remove the en passantable pawn from board
    if(move.type === MoveType.ENPASSANT){
        let enPassantPawnIndex = (position.player === Color.WHITE) ? move.toSquare - 8 : move.toSquare + 8;
        board[enPassantPawnIndex] = {type: PieceType.EMPTY, color: Color.NONE}
    }

    //Add en passant square for pawn move 2
    if(move.type === MoveType.PAWN_MOVE_TWO){
        position.enPassantSquare = (position.player === Color.WHITE) ? move.toSquare + 8 : move.toSquare - 8;
    }

    // Castling move
    if(move.type === MoveType.CASTLE){
        board[move.rookStart as number] = {type: PieceType.EMPTY, color: Color.NONE};
        board[move.rookEnd as number] = {type: PieceType.ROOK, color: player};
        // Change King Location and Castling states
        // Change castling states for rook captures
        // Change castling states for first rook moves
        // Change castling states for rook captures
    }
    
    

    return position;
}

/*
    //Castling move
    if (move.rook_start !== null) {
        let rook = JSON.parse(JSON.stringify(squares[move.rook_start]));
        squares[move.rook_start] = null;
        squares[move.rook_end] = rook;
        rook.has_moved = true;
    }
    //Change King Location and Castling states
    if (piece.name === 'King') {
        if (piece.player === 'white') {
            king_locations[0] = end
            castle_state[0] = 0;
            castle_state[1] = 0;
        }
        else {
            king_locations[1] = end
            castle_state[2] = 0;
            castle_state[3] = 0;
        }
    }
    // Change castling states for first rook moves
    if (piece.name === 'Rook' && !piece.has_moved) {
        if (start === wk_rook) {
            castle_state[0] = 0;
        }
        else if (start === wq_rook) {
            castle_state[1] = 0;
        }
        else if (start === bk_rook) {
            castle_state[2] = 0;
        }
        else if (start === bq_rook) {
            castle_state[3] = 0;
        }
    }
    // Change castling states for rook captures
    if (squares[end] !== null && squares[end].name === 'Rook') {
        if (end === wk_rook) {
            castle_state[0] = 0;
        }
        else if (end === wq_rook) {
            castle_state[1] = 0;
        }
        else if (end === bk_rook) {
            castle_state[2] = 0;
        }
        else if (end === bq_rook) {
            castle_state[3] = 0;
        }
    }
    //Change material Balance
    if (material_balance !== null && squares[end] !== null) {
        if (position.player === 'white') {
            material_balance = material_balance + piece_scores[squares[end].name];
        }
        else {
            material_balance = material_balance - piece_scores[squares[end].name];
        }
    }

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