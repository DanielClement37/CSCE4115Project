import { PieceType, Color, MoveType } from "../enums/GameEnums";
import { GenerateMoves } from "./MoveGen";

export function perft(depth: number, position: Position) {
    if (depth === 0) {
        return 1;
    }
    else {
        let nodes = 0;
        let moves = GenerateMoves(position);
        for (var i = 0; i < moves.length; i++) {
            let currentMove = moves[i];
            //let next_position = makeMove(position, current_move);
            //nodes = nodes + perft(depth-1, next_position);

        }
        return nodes;
    }
}