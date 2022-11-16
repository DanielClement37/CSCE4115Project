enum PieceType {
  EMPTY = 0,
  PAWN = 1,
  BISHOP = 2,
  KNIGHT = 3,
  ROOK = 4,
  QUEEN = 5,
  KING = 6,
  BOUNDARY = 7,
}

enum Color {
  BLACK = 0,
  WHITE = 1,
  NONE = 2,
}

enum MoveType {
  QUIET = 0,
  CAPTURE = 1,
  ENPASSANT = 2,
  CASTLE = 3,
  PROMOTION = 4,
  CHECK = 5,
  DISCOVER_CHECK = 6,
  DOUBLE_CHECK = 7,
  CHECKMATE = 8,
  UNKNOWN = 9,
  PROMOTION_CAPTURE = 10
}


interface Piece {
  type: PieceType;
  color: Color;
}

interface Move {
  player: Color;
  fromSquare: number;
  toSquare: number;
  enPassantSquare:number | null;
  piece: PieceType;
  type: MoveType
}

interface Position{
  player: Color;
  squares: Piece[],
  castleState: number[];
  kingLocations: number[];
  enPassantSquare:number | null;
}

interface ChessGame {
  history: [Position];
  currPosition: Position
  moveList: Move[];
  whiteCaptured: Piece[];
  blackCaptured: Piece[];
  moveNum: number;
}
