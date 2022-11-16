export enum ActionType{
    ResetGame,
    MakeMove,
    UndoMove
}

export interface ResetGame{
    type: ActionType.ResetGame,
}

export interface MakeMove{
    type: ActionType.MakeMove,
    payload: [board:Piece[], move:Move]
}

export interface UndoMove{
    type: ActionType.UndoMove,
}

export type GameActions = ResetGame | MakeMove | UndoMove;